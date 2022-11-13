import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Theme } from 'src/entities/theme.entity';
import { Spot } from 'src/entities/spots.entity';
import { Rank } from 'src/entities/rank.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockRankRepository } from 'test/mock/rank.mock';
import { SearchRequestDto } from './dto/search-request.dto';
import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';

import { SpotsService } from './spots.service';

describe('SpotsService', () => {
	let spotsService: SpotsService;
	let spotsRepository: MockSpotsRepository;
	let themeRepository: MockThemeRepository;
	let snsPostRepository: MockSnsPostsRepository;
	let locationsRepository: MockLocationsRepository;
	let rankRepository: MockRankRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpotsService,

				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
				{
					provide: getRepositoryToken(SnsPost),
					useClass: MockSnsPostsRepository,
				},
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				{
					provide: getRepositoryToken(Rank),
					useClass: MockRankRepository,
				},
			],
		}).compile();

		spotsService = module.get<SpotsService>(SpotsService);
		locationsRepository = module.get(getRepositoryToken(Location));
		snsPostRepository = module.get(getRepositoryToken(SnsPost));
		themeRepository = module.get(getRepositoryToken(Theme));
		spotsRepository = module.get(getRepositoryToken(Spot));
		rankRepository = module.get(getRepositoryToken(Rank));
	});

	it('should be defined', () => {
		expect(spotsService).toBeDefined();
	});
	const detailSpotRequest = new DetailSpotRequestDto();
	const spotId = 1;
	describe('getDetailSpot function', () => {
		beforeEach(async () => {
			await spotsService.getDetailSpot(detailSpotRequest, spotId);
		});
		it('getDetailSpot 함수의 공통 createQueryBuilder가 정상적으로 호출된다.', async () => {
			expect(snsPostRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
			expect(snsPostRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledTimes(2);
			expect(snsPostRepository.createQueryBuilder().where).toHaveBeenCalledTimes(1);
			expect(snsPostRepository.createQueryBuilder().limit).toHaveBeenCalledTimes(1);
		});
		it('테마 필터링이 존재할 경우 andWhere 호출 횟수가 증가한다.', async () => {
			expect(snsPostRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(0);

			detailSpotRequest.themeId = 1;
			await spotsService.getDetailSpot(detailSpotRequest, spotId);
			if (detailSpotRequest.themeId)
				expect(snsPostRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(1);
		});
	});
	describe('getSearchSpot function', () => {
		const searchRequest = new SearchRequestDto();
		beforeEach(async () => {
			await spotsService.getSearchSpot(searchRequest);
		});
		it('getSearchSpot 함수의 공통 createQueryBuilder가 정상적으로 호출된다.', async () => {
			expect(spotsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().orderBy).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().where).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().limit).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().offset).toHaveBeenCalledTimes(1);
		});
		it('위치 필터링/테마 필터링이 존재할 경우 andWhere 호출 횟수가 증가한다.', async () => {
			expect(spotsRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(0);

			searchRequest.locationId = 1;
			await spotsService.getSearchSpot(searchRequest);
			expect(spotsRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(1);

			searchRequest.themeId = 1;
			await spotsService.getSearchSpot(searchRequest);
			expect(spotsRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(3);
		});
	});
	describe('getFilterList function', () => {
		beforeEach(async () => {
			await spotsService.getFilterList();
		});
		it('theme, location find가 정상적으로 실행된다.', async () => {
			expect(themeRepository.find).toHaveBeenCalledTimes(1);
			expect(locationsRepository.find).toHaveBeenCalledTimes(1);
		});
	});
});
