import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { Theme } from 'src/entities/theme.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

describe('FiltersController', () => {
	let controller: FiltersController;

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

		controller = module.get<FiltersController>(FiltersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
