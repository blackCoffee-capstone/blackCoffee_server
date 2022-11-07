import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdForm } from 'src/entities/ad-form.entity';
import { AdFormsRequestDto } from './dto/ad-forms-request.dto';
import { AdFormsResponseDto } from './dto/ad-forms-response.dto';

@Injectable()
export class AdFormsService {
	constructor(
		@InjectRepository(AdForm)
		private readonly adFormsRepository: Repository<AdForm>,
	) {}

	async registerAdForm(licenseFile: Express.Multer.File, adFormData: AdFormsRequestDto): Promise<AdFormsResponseDto> {
		if (!licenseFile) {
			throw new BadRequestException('File is not exist');
		}
		const adForm = await this.adFormsRepository.save({
			...adFormData,
			licenseUrl: 'test', //TODO: ncloud object storage에 file 넣기로 수정
		});
		return new AdFormsResponseDto(adForm);
	}
}
