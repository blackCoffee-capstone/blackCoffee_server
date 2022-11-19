import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockTasteThemesRepository } from 'test/mock/taste-themes.mock';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsController', () => {
	let controller: RecommendationsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RecommendationsController],
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

		controller = module.get<RecommendationsController>(RecommendationsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
