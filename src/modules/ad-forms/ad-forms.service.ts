import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';

import { NcloudConfig } from 'src/config/config.constant';
import { AdForm } from 'src/entities/ad-form.entity';
import { Location } from 'src/entities/locations.entity';
import { AdFormsRequestDto } from './dto/ad-forms-request.dto';

@Injectable()
export class AdFormsService {
	constructor(
		@InjectRepository(AdForm)
		private readonly adFormsRepository: Repository<AdForm>,
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
		private readonly configService: ConfigService,
	) {}

	#ncloudConfig = this.configService.get<NcloudConfig>('ncloudConfig');

	async registerAdForm(licenseFile: Express.Multer.File, adFormData: AdFormsRequestDto): Promise<boolean> {
		if (!licenseFile) {
			throw new BadRequestException('File is not exist');
		}

		const licenseUrl = await this.uploadFileToS3('licenses', licenseFile);
		try {
			await this.adFormsRepository.save({
				businessName: adFormData.businessName,
				address: adFormData.address,
				email: adFormData.email ? adFormData.email : null,
				requirement: adFormData.requirement,
				licenseUrl,
			});

			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async uploadFileToS3(folder: string, file: Express.Multer.File): Promise<string> {
		const imageName = uuid();
		const fileUrl = `${this.#ncloudConfig.storageEndPoint}/${
			this.#ncloudConfig.storageBucket
		}/${folder}/${imageName}${file.originalname}`;

		const s3 = new AWS.S3({
			endpoint: new AWS.Endpoint(this.#ncloudConfig.storageEndPoint),
			region: 'kr-standard',
			credentials: {
				accessKeyId: this.#ncloudConfig.accessKeyId,
				secretAccessKey: this.#ncloudConfig.secretAccessKey,
			},
		});

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

	getMetroLocalName(location: string) {
		let isOneLevel = false;
		const addressArr: string[] = location.split(' ');
		let metroName = addressArr[0];
		const localName = addressArr[1];

		if (metroName.includes('특별자치도')) {
			metroName = metroName.replace(/특별자치도/g, '');
		} else if (metroName.includes('광역시')) {
			metroName = metroName.replace(/광역시/g, '');
		} else if (metroName.includes('특별시')) {
			metroName = metroName.replace(/특별시/g, '');
		} else if (metroName.includes('특별자치시')) {
			isOneLevel = true;
			metroName = metroName.replace(/특별자치시/g, '');
		}

		return {
			isOneLevel,
			metroName,
			localName,
		};
	}

	async getAddressLocationId(isOneLevel: boolean, metroName: string, localName: string): Promise<number> {
		let locationData;
		if (isOneLevel) {
			locationData = await this.locationsRepository
				.createQueryBuilder('location')
				.select('location.id')
				.where('location.metroName like :metroName', { metroName: `%${metroName}%` })
				.getOne();
		} else {
			locationData = await this.locationsRepository
				.createQueryBuilder('location')
				.select('location.id')
				.where('location.metroName like :metroName', { metroName: `%${metroName}%` })
				.andWhere('location.localName like :localName', { localName: `%${localName}%` })
				.getOne();
		}
		if (!locationData) {
			throw new BadRequestException('Location is not found');
		}

		return locationData.id;
	}
}
