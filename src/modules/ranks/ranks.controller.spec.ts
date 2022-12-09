import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Rank } from 'src/entities/rank.entity';
import { Spot } from 'src/entities/spots.entity';
import { MockRankRepository } from 'test/mock/rank.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { RankingListResponseDto } from './dto/ranking-list-response.dto';
import { RankingMapResponseDto } from './dto/ranking-map-response.dto';
import { RankingRequestDto } from './dto/ranking-request.dto';
import { RanksController } from './ranks.controller';
import { RanksService } from './ranks.service';

describe('RanksController', () => {
	let ranksController: RanksController;
	let ranksRepository: MockRankRepository;
	let spotsRepository: MockSpotsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RanksController],
			providers: [
				RanksService,
				{
					provide: getRepositoryToken(Rank),
					useClass: MockRankRepository,
				},
				RanksService,
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
			],
		}).compile();

		ranksController = module.get<RanksController>(RanksController);
		ranksRepository = module.get(getRepositoryToken(Rank));
		spotsRepository = module.get(getRepositoryToken(Spot));
	});
	it('should be defined', () => {
		expect(ranksController).toBeDefined();
	});
	describe('ranksList()', () => {
		it('ranking 순위를 list 기준으로 반환한다.', async () => {
			const allRanks = await ranksRepository.find();
			await ranksRepository.createQueryBuilder().getMany.mockResolvedValue(allRanks);

			const ranks = await ranksRepository.find();
			await spotsRepository.createQueryBuilder().getRawMany.mockResolvedValue(ranks);
			const ranking = Array.from(ranks).map(function (spot) {
				return new RankingListResponseDto({
					...spot,
					rank: spot.after_rank,
					variance: null,
					photoUrl: spot.photo,
					views: spot.clicks,
				});
			});

			const rankingRequest = new RankingRequestDto();
			await expect(ranksController.ranksList(rankingRequest)).resolves.toEqual({
				prev: null,
				next: null,
				ranking: ranking,
			});
		});
	});
	describe('ranksMap()', () => {
		it('ranking 순위를 map 기준으로 반환한다.', async () => {
			const allRanks = await ranksRepository.find();
			await ranksRepository.createQueryBuilder().getMany.mockResolvedValue(allRanks);

			const ranks = await ranksRepository.find();
			await spotsRepository.createQueryBuilder().getRawMany.mockResolvedValue(ranks);
			const ranking = Array.from(ranks).map(function (spot) {
				return new RankingMapResponseDto({ ...spot, rank: spot.current_rank });
			});

			const rankingRequest = new RankingRequestDto();
			await expect(ranksController.ranksMap(rankingRequest)).resolves.toEqual({
				prev: null,
				next: null,
				ranking: ranking,
			});
		});
	});
});
