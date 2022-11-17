import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SnsPost } from 'src/entities/sns-posts.entity';

import { Spot } from 'src/entities/spots.entity';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { TasteThemesController } from './taste-themes.controller';
import { TasteThemesService } from './taste-themes.service';

describe('TasteThemesController', () => {
	let tasteThemesController: TasteThemesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TasteThemesController],
			providers: [
				TasteThemesService,
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
				{
					provide: getRepositoryToken(SnsPost),
					useClass: MockSnsPostsRepository,
				},
			],
		}).compile();

		tasteThemesController = module.get<TasteThemesController>(TasteThemesController);
	});

	it('should be defined', () => {
		expect(tasteThemesController).toBeDefined();
	});
});
