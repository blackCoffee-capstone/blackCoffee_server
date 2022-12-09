import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Theme } from 'src/entities/theme.entity';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { TasteThemesController } from './taste-themes.controller';
import { TasteThemesService } from './taste-themes.service';

describe('TasteThemesController', () => {
	let tasteThemesController: TasteThemesController;
	let themesRepository: MockThemeRepository;

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
		themesRepository = module.get(getRepositoryToken(Theme));
	});

	it('should be defined', () => {
		expect(tasteThemesController).toBeDefined();
	});
	describe('getTasteThemes()', () => {
		it('테마취향 선택 리스트를 반환한다.', async () => {
			const themes = await themesRepository.find();
			const themeDtos = [];
			for (const theme of themes) {
				themeDtos.push({
					id: theme.id,
					name: theme.name,
					photo_url: theme.photoUrl,
				});
			}
			themesRepository.createQueryBuilder().getRawMany.mockResolvedValue(themeDtos);

			await expect(tasteThemesController.getTasteThemes()).resolves.toEqual(themes);
		});
	});
});
