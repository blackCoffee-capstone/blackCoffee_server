import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Rank } from 'src/entities/rank.entity';
import { Spot } from 'src/entities/spots.entity';
import { MockRankRepository } from 'test/mock/rank.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { RanksController } from './ranks.controller';
import { RanksService } from './ranks.service';

describe('RanksController', () => {
	let controller: RanksController;

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

		controller = module.get<RanksController>(RanksController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
