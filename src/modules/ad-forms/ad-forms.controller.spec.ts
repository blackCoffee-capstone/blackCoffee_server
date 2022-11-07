import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AdForm } from 'src/entities/ad-form.entity';
import { AdFormType } from 'src/types/ad-form.types';
import { MockAdFormsRepository } from 'test/mock/ad-forms.mock';
import { AdFormsController } from './ad-forms.controller';
import { AdFormsService } from './ad-forms.service';

describe('AdFormsController', () => {
	let adFormsController: AdFormsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdFormsController],
			providers: [
				AdFormsService,
				{
					provide: getRepositoryToken(AdForm),
					useClass: MockAdFormsRepository,
				},
			],
		}).compile();

		adFormsController = module.get<AdFormsController>(AdFormsController);
	});

	it('should be defined', () => {
		expect(adFormsController).toBeDefined();
	});
	describe('RegisterAdForm', () => {
		it('사업자 등록증이 Null이면 BadRequestException error를 throw한다.', async () => {
			await expect(
				adFormsController.registerAdForm(null, {
					businessName: 'blackCoffee',
					latitude: 37.253452,
					longitude: 126.234523,
					email: 'test@gmail.com',
					phoneNumber: '010-1234-1234',
					requirement: 'test',
					status: AdFormType.Todo,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
