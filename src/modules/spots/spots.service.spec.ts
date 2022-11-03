import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { Location } from 'src/entities/locations.entity';

import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { SpotsService } from './spots.service';

describe('SpotsService', () => {
	let spotsService: SpotsService;
	let spotsRepository: MockSpotsRepository;
	let locationsRepository: MockLocationsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpotsService,
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
			],
		}).compile();

		spotsService = module.get<SpotsService>(SpotsService);
		spotsRepository = module.get(getRepositoryToken(Spot));
		locationsRepository = module.get(getRepositoryToken(Location));
	});

	it('should be defined', () => {
		expect(spotsService).toBeDefined();
	});
});
