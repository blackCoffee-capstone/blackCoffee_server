import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { In, Repository } from 'typeorm';
import { uuid } from 'uuidv4';

import { NcloudConfig } from 'src/config/config.constant';
import { AdForm } from 'src/entities/ad-form.entity';
import { Ad } from 'src/entities/ad.entity';
import { Location } from 'src/entities/locations.entity';
import { AdFormsService } from '../ad-forms/ad-forms.service';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { AdFormsFilterRequestDto } from './dto/ad-forms-filter-request.dto';
import { AdFormsResponseDto } from './dto/ad-forms-response.dto';
import { AdFormsStatusRequestDto } from './dto/ad-forms-status-request.dto';
import { AdsRegisterRequestDto } from './dto/ads-register-request.dto';
import { AdsResponseDto } from './dto/ads-response.dto';
import { GetAdFilterRequestDto } from './dto/get-ad-filter-request.dto';
import { GetAdFilterResponseDto } from './dto/get-ad-filter-response.dto';
import { GetAdFormResponseDto } from './dto/get-ad-form.response.dto';
import { GetAdResponseDto } from './dto/get-ad-response.dto';
import { UpdateAdsRequestDto } from './dto/update-ads-request.dto';

@Injectable()
export class AdminsService {
	constructor(
		@InjectRepository(AdForm)
		private readonly adFormsRepository: Repository<AdForm>,
		@InjectRepository(Ad)
		private readonly adsRepository: Repository<Ad>,
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
		private readonly adFormsService: AdFormsService,
		private readonly configService: ConfigService,
	) {}
	#ncloudConfig = this.configService.get<NcloudConfig>('ncloudConfig');

	async getAllAdForms(AdFormsFilterRequest: AdFormsFilterRequestDto) {
		try {
			const adFormFiltering = await this.adFormsRepository.find({
				where: { status: AdFormsFilterRequest.status },
				order: { createdAt: 'DESC' },
			});
			return adFormFiltering.map((adForm) => new AdFormsResponseDto(adForm));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getAdForm(adFormId: number) {
		const adForm = await this.adFormsRepository.findOne({ where: { id: adFormId } });
		if (!adForm) throw new NotFoundException('AdForm is not found');
		try {
			return new GetAdFormResponseDto(adForm);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async changeAdsStatus(adFormId: number, AdFormsStatusRequest: AdFormsStatusRequestDto) {
		const adForm = await this.adFormsRepository.findOne({ where: { id: adFormId } });
		if (!adForm) throw new NotFoundException('AdForm is not found');
		try {
			await this.adFormsRepository.update(adForm.id, {
				status: AdFormsStatusRequest.status,
			});
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async deleteAdForm(adFormId: number) {
		const adForm = await this.adFormsRepository.findOne({ where: { id: adFormId } });
		if (!adForm) throw new NotFoundException('AdForm is not found');
		try {
			await this.deleteFileToS3('licenses', adForm.licenseUrl);
			await this.adFormsRepository.delete(adForm.id);
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async allSelection(locationIds) {
		return await this.locationsRepository
			.createQueryBuilder('location')
			.leftJoinAndSelect('location.ads', 'ads')
			.select('location.id AS id')
			.where((metroNames) => {
				const subQuery = metroNames
					.subQuery()
					.select('location.metroName')
					.where('location.localName is null')
					.andWhere('location.id IN (:...ids)', { ids: locationIds })
					.from(Location, 'location')
					.getQuery();
				return 'location.metroName IN' + subQuery;
			})
			.andWhere('ads.id is not null')
			.distinctOn(['location.id'])
			.getRawMany();
	}

	async getAdsFilter(getAdRequest?: GetAdFilterRequestDto) {
		try {
			const ads = this.adsRepository.createQueryBuilder('ad');
			if (getAdRequest.locationIds && getAdRequest.locationIds[0] !== 0) {
				let locationIds = getAdRequest.locationIds;
				const allSelection = await this.allSelection(locationIds);
				const localsIds = allSelection.flatMap(({ id }) => [id]);
				locationIds = [...new Set(locationIds.concat(localsIds))];

				ads.where('ad.locationId IN (:...ids)', { ids: locationIds });
			}
			const finalAds = await ads.orderBy('RANDOM()').limit(5).getMany();

			return finalAds.map((ad) => new GetAdFilterResponseDto(ad));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getAllAds() {
		try {
			const ads = await this.adsRepository.find({ order: { createdAt: 'DESC' } });
			return ads.map((ad) => new AdsResponseDto(ad));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getAds(adId: number) {
		const ad = await this.adsRepository.findOne({ where: { id: adId } });
		if (!ad) throw new NotFoundException('Ad is not found');
		try {
			const locaitonDto = new LocationResponseDto(
				await this.locationsRepository.findOne({ where: { id: ad.locationId } }),
			);
			return new GetAdResponseDto({ ...ad, location: locaitonDto });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async registerAds(adFile: Express.Multer.File, AdsRegisterRequest: AdsRegisterRequestDto) {
		if (!adFile) throw new BadRequestException('File is not exist');
		const ad = await this.adsRepository.findOne({ where: { pageUrl: AdsRegisterRequest.pageUrl } });
		if (ad) throw new BadRequestException('Ad is already registered');

		try {
			const adBackgroundUrl = await this.uploadFileToS3('ads', adFile);

			const metroLocalName = this.adFormsService.getMetroLocalName(AdsRegisterRequest.address);
			const locationId = await this.adFormsService.getAddressLocationId(
				metroLocalName.isOneLevel,
				metroLocalName.metroName,
				metroLocalName.localName,
			);
			await this.adsRepository.save({ ...AdsRegisterRequest, photoUrl: adBackgroundUrl, locationId: locationId });
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async updateAds(adId: number, photo?: Express.Multer.File, updateAd?: UpdateAdsRequestDto) {
		const ad = await this.adsRepository.findOne({ where: { id: adId } });
		if (!ad) throw new NotFoundException('Ad is not found');
		try {
			const updateData = {
				businessName: updateAd.businessName ? updateAd.businessName : ad.businessName,
				email: updateAd.email ? updateAd.email : ad.email,
				pageUrl: updateAd.pageUrl ? updateAd.pageUrl : ad.pageUrl,
				photoUrl: photo ? null : ad.photoUrl,
				locationId: updateAd.address ? 0 : ad.locationId,
				address: updateAd.address ? updateAd.address : ad.address,
			};
			if (photo) {
				await this.deleteFileToS3('ads', ad.photoUrl);
				updateData.photoUrl = await this.uploadFileToS3('ads', photo);
			}
			if (updateAd.address) {
				const metroLocalName = this.adFormsService.getMetroLocalName(updateAd.address);
				updateData.locationId = await this.adFormsService.getAddressLocationId(
					metroLocalName.isOneLevel,
					metroLocalName.metroName,
					metroLocalName.localName,
				);
			}
			await this.adsRepository.update(ad.id, updateData);
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async deleteAds(adId: number) {
		const ad = await this.adsRepository.findOne({ where: { id: adId } });
		if (!ad) throw new NotFoundException('Ad is not found');
		try {
			await this.deleteFileToS3('ads', ad.photoUrl);
			await this.adsRepository.delete(ad.id);
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async uploadFileToS3(folder: string, file: Express.Multer.File): Promise<string> {
		const s3 = new AWS.S3({
			endpoint: new AWS.Endpoint(this.#ncloudConfig.storageEndPoint),
			region: 'kr-standard',
			credentials: {
				accessKeyId: this.#ncloudConfig.accessKeyId,
				secretAccessKey: this.#ncloudConfig.secretAccessKey,
			},
		});
		const imageName = uuid();
		const fileUrl = `${this.#ncloudConfig.storageEndPoint}/${
			this.#ncloudConfig.storageBucket
		}/${folder}/${imageName}${file.originalname}`;
		await s3
			.putObject({
				Bucket: this.#ncloudConfig.storageBucket,
				Key: `${folder}/${imageName}${file.originalname}`,
				ACL: 'public-read',
				Body: file.buffer,
				ContentType: file.mimetype,
			})
			.promise()
			.catch((error) => {
				throw new InternalServerErrorException(error.message, error);
			});
		return fileUrl;
	}

	private async deleteFileToS3(folder: string, fileUrl: string): Promise<boolean> {
		const s3 = new AWS.S3({
			endpoint: new AWS.Endpoint(this.#ncloudConfig.storageEndPoint),
			region: 'kr-standard',
			credentials: {
				accessKeyId: this.#ncloudConfig.accessKeyId,
				secretAccessKey: this.#ncloudConfig.secretAccessKey,
			},
		});
		const deleteParam = {
			Bucket: this.#ncloudConfig.storageBucket,
			Key: fileUrl.replace(`${this.#ncloudConfig.storageEndPoint}/${this.#ncloudConfig.storageBucket}/`, ''),
		};
		await s3
			.deleteObject(deleteParam)
			.promise()
			.catch((error) => {
				throw new InternalServerErrorException(error.message, error);
			});
		return true;
	}
}
