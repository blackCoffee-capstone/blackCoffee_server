import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocalLocation } from 'src/entities/local-locations.entity';
import { MetroLocation } from 'src/entities/metro-locations.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { MockLocalLocationsRepository } from 'test/mock/local-locations.mock';
import { MockMetroLocationsRepository } from 'test/mock/metro-locations.mock';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';

describe('SpotsController', () => {
	let spotsController: SpotsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SpotsController],
			providers: [
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
					provide: getRepositoryToken(LocalLocation),
					useClass: MockLocalLocationsRepository,
				},
				SpotsService,
				{
					provide: getRepositoryToken(MetroLocation),
					useClass: MockMetroLocationsRepository,
				},
			],
		}).compile();

		spotsController = module.get<SpotsController>(SpotsController);
	});

	it('should be defined', () => {
		expect(spotsController).toBeDefined();
	});
});
