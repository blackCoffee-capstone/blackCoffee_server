import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClickSpot } from 'src/entities/click-spots.entity';
import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { MockClickSpotsRepository } from 'test/mock/click-spots.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockTasteThemesRepository } from 'test/mock/taste-themes.mock';
import { MockWishSpotsRepository } from 'test/mock/wish-spots.mock';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsService', () => {
	let service: RecommendationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RecommendationsService,
				{
					provide: getRepositoryToken(TasteTheme),
					useClass: MockTasteThemesRepository,
				},
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
				{
					provide: getRepositoryToken(WishSpot),
					useClass: MockWishSpotsRepository,
				},
				{
					provide: getRepositoryToken(ClickSpot),
					useClass: MockClickSpotsRepository,
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'sshConfig') {
								return 1;
							}
							return null;
						}),
					},
				},
			],
		}).compile();

		service = module.get<RecommendationsService>(RecommendationsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
