import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ad } from 'src/entities/ad.entity';
import { Location } from 'src/entities/locations.entity';
import { MockAdsRepository } from 'test/mock/ads.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { GetAdFilterResponseDto } from './dto/get-ad-filter-response.dto';

describe('AdsController', () => {
	let adsController: AdsController;
	let adsRepository: MockAdsRepository;
	let locationsRepository: MockLocationsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdsController],
			providers: [
				AdsService,
				{
					provide: getRepositoryToken(Ad),
					useClass: MockAdsRepository,
				},
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
			],
		}).compile();

		adsController = module.get<AdsController>(AdsController);
		adsRepository = module.get(getRepositoryToken(Ad));
		locationsRepository = module.get(getRepositoryToken(Location));
	});

	it('should be defined', () => {
		expect(adsController).toBeDefined();
	});
	describe('getAdsFilter()', () => {
		it('게시용 광고 목록을 반환한다.', async () => {
			const ads = await adsRepository.find();
			const expectAds = ads.map((item) => new GetAdFilterResponseDto(item));
			await adsRepository.createQueryBuilder().getMany.mockResolvedValue(expectAds);
			await expect(adsController.getAdsFilter({})).resolves.toEqual(expectAds);
		});
	});
	describe('clickAds()', () => {
		it('광고가 없으면 NotFoundException error를 반환한다.', async () => {
			const expectAd = adsRepository.createQueryBuilder().getOne.mockResolvedValue();

			await expect(adsController.clickAds({ adId: 3 })).rejects.toThrow(NotFoundException);
		});
		it('광고 클릭 요청 올 때마다 횟수 증가한다.', async () => {
			const ad = await adsRepository.find();
			const expectAd = adsRepository.createQueryBuilder().getOne.mockResolvedValue(ad[0]);

			await adsRepository.update.mockResolvedValue({
				...expectAd,
				click: () => 'click+1',
			});
			await expect(adsController.clickAds({ adId: 1 })).resolves.toEqual(true);
		});
	});
});
