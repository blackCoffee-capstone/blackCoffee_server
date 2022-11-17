import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SnsPost } from 'src/entities/sns-posts.entity';

import { Spot } from 'src/entities/spots.entity';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { TasteThemesService } from './taste-themes.service';

describe('TasteThemesService', () => {
	let tasteThemesService: TasteThemesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
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

		tasteThemesService = module.get<TasteThemesService>(TasteThemesService);
	});

	it('should be defined', () => {
		expect(tasteThemesService).toBeDefined();
	});
});
