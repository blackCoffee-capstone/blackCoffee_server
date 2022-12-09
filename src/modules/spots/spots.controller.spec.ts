import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';
import { ClickSpot } from 'src/entities/click-spots.entity';
import { Location } from 'src/entities/locations.entity';
import { Rank } from 'src/entities/rank.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { MockClickSpotsRepository } from 'test/mock/click-spots.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { MockWishSpotsRepository } from 'test/mock/wish-spots.mock';
import { KakaoAuthStrategy } from '../auth/strategies/kakao-auth.strategy';
import { RanksService } from '../ranks/ranks.service';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';
import { SearchResponseDto } from './dto/search-response.dto';
import { SortType } from 'src/types/sort.types';
import { BadRequestException } from '@nestjs/common';

describe('SpotsController', () => {
	let spotsController: SpotsController;
	let spotsRepository: MockSpotsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			controllers: [SpotsController],
			providers: [
				SpotsService,
				{
					provide: JwtService,
					useValue: {
						sign: () => '',
					},
				},
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
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
					provide: getRepositoryToken(Rank),
					useClass: MockSnsPostsRepository,
				},
				{
					provide: getRepositoryToken(ClickSpot),
					useClass: MockClickSpotsRepository,
				},
				{
					provide: getRepositoryToken(WishSpot),
					useClass: MockWishSpotsRepository,
				},
				KakaoAuthStrategy,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'oauthConfig' || key === 'jwtConfig') {
								return 1;
							}
							return null;
						}),
					},
				},
				RanksService,
			],
		}).compile();

		spotsController = module.get<SpotsController>(SpotsController);
		spotsRepository = module.get(getRepositoryToken(Spot));
	});
	it('should be defined', () => {
		expect(spotsController).toBeDefined();
	});
	describe('createSpots()', () => {
		it('여행지 생성 파일이 없으면 BadRequestException error를 throw한다.', async () => {
			await expect(spotsController.createSpots(null)).rejects.toThrow(BadRequestException);
		});
	});
	describe('updateSnsPostPhotos()', () => {
		it('sns post의 photoUrl 파일이 없으면 BadRequestException error를 throw한다.', async () => {
			await expect(spotsController.updateSnsPostPhotos(null)).rejects.toThrow(BadRequestException);
		});
	});
	describe('searchSpot()', () => {
		it('필터링 / 정렬 / 검색 여행지 정보를 반환한다.', async () => {
			const spots = await spotsRepository.find();
			const expectSpots = spots.map((spot) => new SearchResponseDto(spot));
			await spotsRepository.createQueryBuilder().getRawMany.mockResolvedValue(expectSpots);
			await expect(
				spotsController.searchSpot(
					{ header: null },
					{
						page: 1,
						take: 20,
						sorter: SortType.View,
						word: 'test',
						locationIds: [1, 2, 3],
						themeIds: [1, 2, 3],
					},
				),
			).resolves.toEqual({
				totalPage: 1,
				spots: expectSpots,
			});
		});
	});
});
