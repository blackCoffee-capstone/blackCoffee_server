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
import { SpotsService } from './spots.service';

describe('SpotsService', () => {
	let spotsService: SpotsService;
	let spotsRepository: MockSpotsRepository;
	let themeRepository: MockThemeRepository;
	let snsPostRepository: MockSnsPostsRepository;
	let localLocationsRepository: MockLocalLocationsRepository;
	let MetroLocationsRepository: MockMetroLocationsRepository;

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
					provide: getRepositoryToken(LocalLocation),
					useClass: MockLocalLocationsRepository,
				},
				{
					provide: getRepositoryToken(MetroLocation),
					useClass: MockMetroLocationsRepository,
				},
			],
		}).compile();

		spotsService = module.get<SpotsService>(SpotsService);
		spotsRepository = module.get(getRepositoryToken(Spot));
		themeRepository = module.get(getRepositoryToken(Theme));
		snsPostRepository = module.get(getRepositoryToken(SnsPost));
		localLocationsRepository = module.get(getRepositoryToken(LocalLocation));
		MetroLocationsRepository = module.get(getRepositoryToken(MetroLocation));
	});

	it('should be defined', () => {
		expect(spotsService).toBeDefined();
	});
});
