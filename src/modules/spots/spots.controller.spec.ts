import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { Location } from 'src/entities/locations.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';

describe('SpotsController', () => {
	let spotsController: SpotsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SpotsController],
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

		spotsController = module.get<SpotsController>(SpotsController);
	});

	it('should be defined', () => {
		expect(spotsController).toBeDefined();
	});
});
