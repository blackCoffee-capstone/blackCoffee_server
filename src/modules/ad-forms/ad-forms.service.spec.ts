import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdForm } from 'src/entities/ad-form.entity';
import { Location } from 'src/entities/locations.entity';
import { MockAdFormsRepository } from 'test/mock/ad-forms.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
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
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'ncloudConfig') {
								return 1;
							}
							return null;
						}),
					},
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
					address: '서울 중구',
					email: 'test@gmail.com',
					phoneNumber: '010-1234-1234',
					requirement: 'test',
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
