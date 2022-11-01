import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
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
			],
		}).compile();

		spotsController = module.get<SpotsController>(SpotsController);
	});

	it('should be defined', () => {
		expect(spotsController).toBeDefined();
	});
});
