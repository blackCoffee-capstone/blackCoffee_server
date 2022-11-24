import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';

import { NcloudConfig } from 'src/config/config.constant';
import { AdForm } from 'src/entities/ad-form.entity';
import { AdFormsRequestDto } from './dto/ad-forms-request.dto';
import { AdFormsResponseDto } from './dto/ad-forms-response.dto';

@Injectable()
export class AdFormsService {
	constructor(
		@InjectRepository(AdForm)
		private readonly adFormsRepository: Repository<AdForm>,
		private readonly configService: ConfigService,
	) {}

	#ncloudConfig = this.configService.get<NcloudConfig>('ncloudConfig');

	async registerAdForm(licenseFile: Express.Multer.File, adFormData: AdFormsRequestDto): Promise<AdFormsResponseDto> {
		if (!licenseFile) {
			throw new BadRequestException('File is not exist');
		}
		try {
			const geom = `(${adFormData.latitude.toString()},${adFormData.longitude.toString()})`;
			const licenseUrl = await this.uploadFileToS3('licenses', licenseFile);

			const adForm = await this.adFormsRepository.save({
				businessName: adFormData.businessName,
				latitude: Number(adFormData.latitude),
				longitude: Number(adFormData.longitude),
				email: adFormData.email ? adFormData.email : null,
				requirement: adFormData.requirement,
				licenseUrl,
				geom,
			});

			return new AdFormsResponseDto(adForm);
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
			.promise();

		return fileUrl;
	}
}
