import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Theme } from 'src/entities/theme.entity';
import { MockThemeRepository } from 'test/mock/theme.mock';
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
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
			],
		}).compile();

		tasteThemesController = module.get<TasteThemesController>(TasteThemesController);
	});

	it('should be defined', () => {
		expect(tasteThemesController).toBeDefined();
	});
});
