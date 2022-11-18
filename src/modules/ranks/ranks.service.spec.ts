import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Rank } from 'src/entities/rank.entity';
import { Spot } from 'src/entities/spots.entity';
import { MockRankRepository } from 'test/mock/rank.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { RanksService } from './ranks.service';

describe('RanksService', () => {
	let ranksService: RanksService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RanksService,
				{
					provide: getRepositoryToken(Rank),
					useClass: MockRankRepository,
				},
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
			],
		}).compile();

		ranksService = module.get<RanksService>(RanksService);
	});

	it('should be defined', () => {
		expect(ranksService).toBeDefined();
	});
});
