import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdForm } from 'src/entities/ad-form.entity';
import { Ad } from 'src/entities/ad.entity';
import { Location } from 'src/entities/locations.entity';
import { AdFormType } from 'src/types/ad-form.types';
import { MockAdFormsRepository } from 'test/mock/ad-forms.mock';
import { MockAdsRepository } from 'test/mock/ads.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { AdFormsService } from '../ad-forms/ad-forms.service';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { AdFormsResponseDto } from './dto/ad-forms-response.dto';
import { AdsResponseDto } from './dto/ads-response.dto';
import { GetAdResponseDto } from './dto/get-ad-response.dto';

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
		it('?????? ?????? ????????? ????????????.', async () => {
			const adForms = await adFormsRepository.find();
			const expectAdForms = adForms.map((item) => new AdFormsResponseDto(item));
			adFormsRepository.createQueryBuilder().getMany.mockResolvedValue(expectAdForms);
			await expect(adminsController.getAllAdForms({})).resolves.toEqual(expectAdForms);
		});
		it('?????? ?????? ????????? ??????????????? ????????????.', async () => {
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
		it('?????? ?????? ?????? ???????????? ????????????.', async () => {
			const adForms = {
				id: 1,
				businessName: 'blackCoffee',
				address: '?????? ?????????',
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

		it('?????? ????????? ?????? ??? ????????? NotFoundException error??? throw??????.', async () => {
			const adForms = {
				id: 1,
				businessName: 'blackCoffee',
				address: '?????? ?????????',
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
		it('?????? ?????? ????????? ????????? ??? ??????.', async () => {
			const adForms = {
				id: 1,
				businessName: 'blackCoffee',
				address: '?????? ?????????',
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
		it('?????? ?????? ?????? ????????? ???????????? NotFoundException error??? throw??????.', async () => {
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(null);

			await expect(adminsController.changeAdsStatus(1, { status: AdFormType.Todo })).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('deleteAdForm()', () => {
		it('???????????? ?????? ?????? ????????? ???????????? NotFoundException error??? throw??????.', async () => {
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			adFormsRepository.delete.mockResolvedValue(true);
			await expect(adminsController.deleteAdForm(1)).rejects.toThrow(NotFoundException);
		});
	});

	describe('getAllAds()', () => {
		it('?????? ????????? ????????????.', async () => {
			const ads = await adsRepository.find();
			const expectAds = ads.map((item) => new AdsResponseDto(item));
			adsRepository.createQueryBuilder().getRawMany.mockResolvedValue(expectAds);
			await expect(adminsController.getAllAds()).resolves.toEqual(expectAds);
		});
	});

	describe('getAds()', () => {
		it('?????? ?????? ????????? ????????????.', async () => {
			const ads = await adsRepository.find();
			adsRepository.findOne.mockResolvedValue(ads[0]);
			locationsRepository.findOne.mockResolvedValue(ads[0].location);

			const ad = new GetAdResponseDto({
				...ads[0],
				location: new LocationResponseDto(ads[0].location),
			});

			await expect(adminsController.getAds(1)).resolves.toEqual(ad);
		});
		it('???????????? ?????? ????????? ?????? ????????? ???????????? NotFoundException error??? throw??????.', async () => {
			await adsRepository.find();
			await expect(adminsController.getAds(3)).rejects.toThrow(NotFoundException);
		});
	});

	describe('registerAds', () => {
		it('?????? ?????? ????????? ????????? BadRequestException error??? throw??????.', async () => {
			await expect(
				adminsController.registerAds(null, {
					businessName: 'test',
					email: 'test',
					pageUrl: 'www.test.com',
					address: '?????? ?????????',
				}),
			).rejects.toThrow(BadRequestException);
		});
	});

	describe('updateAds', () => {
		it('???????????? ?????? ????????? ???????????? NotFoundException error??? throw??????.', async () => {
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			adFormsRepository.update.mockResolvedValue(true);
			await expect(adminsController.updateAds(1)).rejects.toThrow(NotFoundException);
		});
	});

	describe('deleteAds', () => {
		it('???????????? ?????? ????????? ???????????? NotFoundException error??? throw??????.', async () => {
			adFormsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			adFormsRepository.delete.mockResolvedValue(true);
			await expect(adminsController.deleteAdForm(1)).rejects.toThrow(NotFoundException);
		});
	});
});
