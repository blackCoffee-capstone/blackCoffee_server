import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdForm } from 'src/entities/ad-form.entity';
import { MockAdFormsRepository } from 'test/mock/ad-forms.mock';
import { AdFormsService } from './ad-forms.service';

describe('AdFormsService', () => {
	let adFormsService: AdFormsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdFormsService,
				{
					provide: getRepositoryToken(AdForm),
					useClass: MockAdFormsRepository,
				},
			],
		}).compile();

		adFormsService = module.get<AdFormsService>(AdFormsService);
	});

	it('should be defined', () => {
		expect(adFormsService).toBeDefined();
	});
	describe('registerAdForm function', () => {
		it('사업자 등록증이 Null이면 BadRequestException error를 throw한다.', async () => {
			await expect(
				adFormsService.registerAdForm(null, {
					businessName: 'blackCoffee',
					latitude: 37.253452,
					longitude: 126.234523,
					geom: '(37.253452, 126.234523)',
					email: 'test@gmail.com',
					phoneNumber: '010-1234-1234',
					requirement: 'test',
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
