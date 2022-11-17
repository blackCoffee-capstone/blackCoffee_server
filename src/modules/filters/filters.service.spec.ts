import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { Theme } from 'src/entities/theme.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';

import { FiltersService } from './filters.service';

describe('FiltersService', () => {
	let filtersService: FiltersService;
	let locationsRepository: MockLocationsRepository;
	let themeRepository: MockThemeRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FiltersService,
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
			],
		}).compile();

		filtersService = module.get<FiltersService>(FiltersService);
		locationsRepository = module.get(getRepositoryToken(Location));
		themeRepository = module.get(getRepositoryToken(Theme));
	});

	it('should be defined', () => {
		expect(filtersService).toBeDefined();
	});
	describe('getFilterList function', () => {
		beforeEach(async () => {
			await filtersService.getFilterList();
		});
		it('theme, location find가 정상적으로 실행된다.', async () => {
			expect(themeRepository.find).toHaveBeenCalledTimes(1);
			expect(locationsRepository.find).toHaveBeenCalledTimes(1);
		});
	});
});
