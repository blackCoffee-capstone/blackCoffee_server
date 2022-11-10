import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { Location } from 'src/entities/locations.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { SpotsService } from './spots.service';
import { SearchRequestDto } from './dto/search-request.dto';

describe('SpotsService', () => {
	let spotsService: SpotsService;
	let spotsRepository: MockSpotsRepository;
	let themeRepository: MockThemeRepository;
	let snsPostRepository: MockSnsPostsRepository;
	let locationsRepository: MockLocationsRepository;

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
			],
		}).compile();

		spotsService = module.get<SpotsService>(SpotsService);
		spotsRepository = module.get(getRepositoryToken(Spot));
		themeRepository = module.get(getRepositoryToken(Theme));
		snsPostRepository = module.get(getRepositoryToken(SnsPost));
		locationsRepository = module.get(getRepositoryToken(Location));
	});

	it('should be defined', () => {
		expect(spotsService).toBeDefined();
	});
	const searchRequest = new SearchRequestDto();
	const spotId = 1;
	describe('getDetailSpot function', () => {
		beforeEach(async () => {
			await spotsService.getDetailSpot(searchRequest, spotId);
		});
		it('getDetailSpot 함수의 공통 createQueryBuilder가 정상적으로 호출된다.', async () => {
			expect(snsPostRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
			expect(snsPostRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledTimes(2);
			expect(snsPostRepository.createQueryBuilder().where).toHaveBeenCalledTimes(1);
		});
		it('테마 필터링이 존재할 경우 andWhere 호출 횟수가 증가한다.', async () => {
			expect(snsPostRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(0);

			searchRequest.themeId = 1;
			await spotsService.getDetailSpot(searchRequest, spotId);
			if (searchRequest.themeId) expect(snsPostRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(1);
		});
		it('detailSnsPost가 null값이 아니면 정상이라고 판단한다.', async () => {
			const snsSpy = jest
				.spyOn(snsPostRepository.createQueryBuilder(), 'getMany')
				.mockResolvedValue([await snsPostRepository.find()]);

			const result = await spotsService.getDetailSpot(searchRequest, spotId);

			expect(snsSpy).toHaveBeenCalledWith();
			expect(result.detailSnsPost !== null);
		});
	});
	describe('getSearchSpot function', () => {
		const searchRequestTwo = new SearchRequestDto();
		beforeEach(async () => {
			await spotsService.getSearchSpot(searchRequest);
		});
		it('getSearchSpot 함수의 공통 createQueryBuilder가 정상적으로 호출된다.', async () => {
			expect(spotsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledTimes(3);
			expect(spotsRepository.createQueryBuilder().orderBy).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().where).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().limit).toHaveBeenCalledTimes(1);
			expect(spotsRepository.createQueryBuilder().offset).toHaveBeenCalledTimes(1);
		});
		it('위치 필터링/테마 필터링이 존재할 경우 andWhere 호출 횟수가 증가한다.', async () => {
			expect(spotsRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(1);

			searchRequestTwo.locationId = 1;

			await spotsService.getSearchSpot(searchRequestTwo);
			expect(spotsRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(2);

			searchRequestTwo.themeId = 1;
			await spotsService.getSearchSpot(searchRequestTwo);
			expect(spotsRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(4);
		});
		it('getSearchSpot이 null값이 아니면 정상이라고 판단한다.', async () => {
			const spotSpy = jest
				.spyOn(spotsRepository.createQueryBuilder(), 'getMany')
				.mockResolvedValue([await snsPostRepository.find()]);

			await spotsService.getSearchSpot(searchRequestTwo);
			expect(spotSpy).toHaveBeenCalledWith();
		});
	});
});
