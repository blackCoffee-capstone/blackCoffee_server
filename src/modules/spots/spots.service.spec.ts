import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { SpotsService } from './spots.service';

describe('SpotsService', () => {
	let spotsService: SpotsService;
	let spotsRepository: MockSpotsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpotsService,
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
			],
		}).compile();

		spotsService = module.get<SpotsService>(SpotsService);
		spotsRepository = module.get(getRepositoryToken(Spot));
	});

	it('should be defined', () => {
		expect(spotsService).toBeDefined();
	});
});
