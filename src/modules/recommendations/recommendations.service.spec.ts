import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockTasteThemesRepository } from 'test/mock/taste-themes.mock';
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
			],
		}).compile();

		service = module.get<RecommendationsService>(RecommendationsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
