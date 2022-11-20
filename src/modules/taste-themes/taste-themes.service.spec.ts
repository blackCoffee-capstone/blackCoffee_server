import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Theme } from 'src/entities/theme.entity';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { TasteThemesService } from './taste-themes.service';

describe('TasteThemesService', () => {
	let tasteThemesService: TasteThemesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasteThemesService,
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
			],
		}).compile();

		tasteThemesService = module.get<TasteThemesService>(TasteThemesService);
	});

	it('should be defined', () => {
		expect(tasteThemesService).toBeDefined();
	});
});
