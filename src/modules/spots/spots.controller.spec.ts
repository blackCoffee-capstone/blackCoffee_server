import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';
import { Rank } from 'src/entities/rank.entity';

describe('SpotsController', () => {
	let spotsController: SpotsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SpotsController],
			providers: [
				SpotsService,
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				SpotsService,
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
				SpotsService,
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
				SpotsService,
				{
					provide: getRepositoryToken(SnsPost),
					useClass: MockSnsPostsRepository,
				},
				SpotsService,
				{
					provide: getRepositoryToken(Rank),
					useClass: MockSnsPostsRepository,
				},
			],
		}).compile();

		spotsController = module.get<SpotsController>(SpotsController);
	});
	it('should be defined', () => {
		expect(spotsController).toBeDefined();
	});
});
