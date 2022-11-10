import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Spot } from 'src/entities/spots.entity';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { TasteSpotsController } from './taste-spots.controller';
import { TasteSpotsService } from './taste-spots.service';

describe('TasteSpotsController', () => {
	let tasteSpotsController: TasteSpotsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TasteSpotsController],
			providers: [
				TasteSpotsService,
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
			],
		}).compile();

		tasteSpotsController = module.get<TasteSpotsController>(TasteSpotsController);
	});

	it('should be defined', () => {
		expect(tasteSpotsController).toBeDefined();
	});
});
