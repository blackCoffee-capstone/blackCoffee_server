import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdForm } from 'src/entities/ad-form.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdFormsService {
	constructor(
		@InjectRepository(AdForm)
		private readonly adFormsRepository: Repository<AdForm>,
	) {}

	async registerAdForm(adFormData) {
		const adForm = await this.adFormsRepository.save(adFormData);
		return adForm;
	}
}
