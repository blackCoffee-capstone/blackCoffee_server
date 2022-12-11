import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Ad } from 'src/entities/ad.entity';
import { AdForm } from 'src/entities/ad-form.entity';
import { Location } from 'src/entities/locations.entity';
import { MockAdsRepository } from 'test/mock/ads.mock';
import { MockAdFormsRepository } from 'test/mock/ad-forms.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { ConfigService } from '@nestjs/config';
import { AdFormsService } from '../ad-forms/ad-forms.service';
import { AdFormsResponseDto } from './dto/ad-forms-response.dto';
import { AdFormType } from 'src/types/ad-form.types';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetAdFilterResponseDto } from './dto/get-ad-filter-response.dto';
import { AdsResponseDto } from './dto/ads-response.dto';
import { GetAdResponseDto } from './dto/get-ad-response.dto';
import { LocationResponseDto } from '../filters/dto/location-response.dto';

describe('AdminsController', () => {
	let adminsController: AdminsController;
	let adsRepository: MockAdsRepository;
	let adFormsRepository: MockAdFormsRepository;
	let locationsRepository: MockLocationsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminsController],
			providers: [
				AdminsService,
				AdFormsService,
				ConfigService,
				{
					provide: getRepositoryToken(Ad),
					useClass: MockAdsRepository,
				},
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

		adminsController = module.get<AdminsController>(AdminsController);
		adsRepository = module.get(getRepositoryToken(Ad));
		adFormsRepository = module.get(getRepositoryToken(AdForm));
		locationsRepository = module.get(getRepositoryToken(Location));
	});

	it('should be defined', () => {
		expect(adminsController).toBeDefined();
	});

	describe('getAllAdForms()', () => {
		it('광고 요청 목록을 반환한다.', async () => {
			const adForms = await adFormsRepository.find();
			const expectAdForms = adForms.map((item) => new AdFormsResponseDto(item));
			adFormsRepository.createQueryBuilder().getMany.mockResolvedValue(expectAdForms);
			await expect(adminsController.getAllAdForms({})).resolves.toEqual(expectAdForms);
		});
		it('광고 요청 목록을 필터링하여 반환한다.', async () => {
			const adForms = await adFormsRepository.find();
			const expectAdForms = adForms.map((item) => new AdFormsResponseDto(item));
			adFormsRepository.createQueryBuilder().getMany.mockResolvedValue(expectAdForms);
			await expect(
				adminsController.getAllAdForms({
					status: AdFormType.Todo,
				}),
			).resolves.toEqual(expectAdForms);
		});
	});

	describe('getAdForm()', () => {
		it('광고 요청 상세 페이지를 반환한다.', async () => {
			const adForms = {
				id: 1,
				businessName: 'blackCoffee',
				address: '인천 연수구',
				email: 'test@gmail.com',
				phoneNumber: '010-1234-1234',
				licenseUrl: 'test',
				requirement: 'test',
				status: AdFormType.Todo,
				createdAt: '2022-12-09',
			};
			const expectAdForms = new AdFormsResponseDto(adForms);
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(expectAdForms);
			adFormsRepository.save.mockResolvedValue(adForms);
			adFormsRepository.findOne.mockResolvedValue(adForms);
			await expect(adminsController.getAdForm(1)).resolves.toEqual(adForms);
		});

		it('요청 광고를 찾을 수 없으면 NotFoundException error를 throw한다.', async () => {
			const adForms = {
				id: 1,
				businessName: 'blackCoffee',
				address: '인천 연수구',
				email: 'test@gmail.com',
				phoneNumber: '010-1234-1234',
				licenseUrl: 'test',
				requirement: 'test',
				status: AdFormType.Todo,
				createdAt: '2022-12-09',
			};
			const expectAdForms = new AdFormsResponseDto(adForms);
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(expectAdForms);
			adFormsRepository.save.mockResolvedValue(adForms);
			adFormsRepository.findOne.mockResolvedValue(null);
			await expect(adminsController.getAdForm(2)).rejects.toThrow(NotFoundException);
		});
	});

	describe('changeAdsStatus()', () => {
		it('광고 요청 상태를 변경할 수 있다.', async () => {
			const adForms = {
				id: 1,
				businessName: 'blackCoffee',
				address: '인천 연수구',
				email: 'test@gmail.com',
				phoneNumber: '010-1234-1234',
				licenseUrl: 'test',
				requirement: 'test',
				status: AdFormType.Todo,
				createdAt: '2022-12-09',
			};
			const expectAdForms = new AdFormsResponseDto(adForms);
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(expectAdForms);
			adFormsRepository.save.mockResolvedValue(adForms);
			adFormsRepository.findOne.mockResolvedValue(adForms);

			await expect(adminsController.changeAdsStatus(1, { status: AdFormType.Todo })).resolves.toEqual(true);
		});
		it('요청 광고 없이 상태를 변경하면 NotFoundException error를 throw한다.', async () => {
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(null);

			await expect(adminsController.changeAdsStatus(1, { status: AdFormType.Todo })).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('deleteAdForm()', () => {
		it('존재하지 않는 요청 광고를 삭제하면 NotFoundException error를 throw한다.', async () => {
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			adFormsRepository.delete.mockResolvedValue(true);
			await expect(adminsController.deleteAdForm(1)).rejects.toThrow(NotFoundException);
		});
	});

	describe('getAdsFilter()', () => {
		it('게시용 광고 목록을 반환한다.', async () => {
			const ads = await adsRepository.find();
			const expectAds = ads.map((item) => new GetAdFilterResponseDto(item));
			await adsRepository.createQueryBuilder().getMany.mockResolvedValue(expectAds);
			await expect(adminsController.getAdsFilter({})).resolves.toEqual(expectAds);
		});
	});

	describe('getAllAds()', () => {
		it('광고 목록을 반환한다.', async () => {
			const ads = await adsRepository.find();
			const expectAds = ads.map((item) => new AdsResponseDto(item));
			adsRepository.createQueryBuilder().getRawMany.mockResolvedValue(expectAds);
			await expect(adminsController.getAllAds()).resolves.toEqual(expectAds);
		});
	});

	describe('getAds()', () => {
		it('광고 상세 정보를 반환한다.', async () => {
			const ads = await adsRepository.find();
			adsRepository.findOne.mockResolvedValue(ads[0]);
			locationsRepository.findOne.mockResolvedValue(ads[0].location);

			const ad = new GetAdResponseDto({
				...ads[0],
				location: new LocationResponseDto(ads[0].location),
			});

			await expect(adminsController.getAds(1)).resolves.toEqual(ad);
		});
		it('존재하지 않는 광고의 상세 정보를 반환하면 NotFoundException error를 throw한다.', async () => {
			await adsRepository.find();
			await expect(adminsController.getAds(3)).rejects.toThrow(NotFoundException);
		});
	});

	describe('registerAds', () => {
		it('광고 배너 사진이 없으면 BadRequestException error를 throw한다.', async () => {
			await expect(
				adminsController.registerAds(null, {
					businessName: 'test',
					email: 'test',
					pageUrl: 'www.test.com',
					address: '경기 수원시',
				}),
			).rejects.toThrow(BadRequestException);
		});
	});

	describe('updateAds', () => {
		it('존재하지 않는 광고를 수정하면 NotFoundException error를 throw한다.', async () => {
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			adFormsRepository.update.mockResolvedValue(true);
			await expect(adminsController.updateAds(1)).rejects.toThrow(NotFoundException);
		});
	});

	describe('deleteAds', () => {
		it('존재하지 않는 광고를 삭제하면 NotFoundException error를 throw한다.', async () => {
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			adFormsRepository.delete.mockResolvedValue(true);
			await expect(adminsController.deleteAdForm(1)).rejects.toThrow(NotFoundException);
		});
	});
});
