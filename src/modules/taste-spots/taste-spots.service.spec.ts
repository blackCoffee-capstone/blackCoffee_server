import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SnsPost } from 'src/entities/sns-posts.entity';

import { Spot } from 'src/entities/spots.entity';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { TasteSpotsService } from './taste-spots.service';

describe('TasteSpotsService', () => {
	let tasteSpotsService: TasteSpotsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasteSpotsService,
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
				{
					provide: getRepositoryToken(SnsPost),
					useClass: MockSnsPostsRepository,
				},
			],
		}).compile();

		tasteSpotsService = module.get<TasteSpotsService>(TasteSpotsService);
	});

	it('should be defined', () => {
		expect(tasteSpotsService).toBeDefined();
	});
});
