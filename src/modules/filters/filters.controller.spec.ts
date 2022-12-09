import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { Theme } from 'src/entities/theme.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { LocationFiltersResponseDto } from './dto/location-filters-response.dto';
import { ThemeResponseDto } from './dto/theme-response.dto';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

describe('FiltersController', () => {
	let filtersController: FiltersController;
	let themesRepository: MockThemeRepository;
	let locationsRepository: MockLocationsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FiltersController],
			providers: [
				FiltersService,
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				FiltersService,
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
			],
		}).compile();

		filtersController = module.get<FiltersController>(FiltersController);
		themesRepository = module.get(getRepositoryToken(Theme));
		locationsRepository = module.get(getRepositoryToken(Location));
	});

	it('should be defined', () => {
		expect(filtersController).toBeDefined();
	});
	describe('filterList()', () => {
		it('위치 필터링 / 테마 필터링 목록을 반환한다.', async () => {
			const themes = await themesRepository.find();
			const themesDto = Array.from(themes).map((theme) => new ThemeResponseDto(theme));

			const locations = await locationsRepository.findMetro();
			await locationsRepository.createQueryBuilder().getRawMany.mockResolvedValue(locations);

			const locationList = await locationsRepository.findFilter();
			await locationsRepository.createQueryBuilder().getRawMany.mockResolvedValue(locationList);
			const locationsDto = Array.from(locationList).map(
				(location) =>
					new LocationFiltersResponseDto({
						...location,
						metroName: location.metro_name,
						localNames: location.locals,
					}),
			);

			await expect(filtersController.filterList()).resolves.toEqual({
				locations: locationsDto,
				themes: themesDto,
			});
		});
	});
});
