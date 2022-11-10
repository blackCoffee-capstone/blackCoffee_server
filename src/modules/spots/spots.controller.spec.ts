import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { Location } from 'src/entities/locations.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';
import { SearchRequestDto } from './dto/search-request.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';

describe('SpotsController', () => {
	let spotsController: SpotsController;
	let spotsService: SpotsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SpotsController],
			providers: [
				SpotsService,
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				SpotsService,
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
				SpotsService,
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
				SpotsService,
				{
					provide: getRepositoryToken(SnsPost),
					useClass: MockSnsPostsRepository,
				},
			],
		}).compile();

		spotsController = module.get<SpotsController>(SpotsController);
		spotsService = module.get<SpotsService>(SpotsService);
	});

	it('should be defined', () => {
		expect(spotsController).toBeDefined();
	});
	const searchRequest = new SearchRequestDto();
	const spotId = 1;
	describe('getDetailSpot function', () => {
		beforeEach(async () => {
			await spotsController.getDetailSpot(searchRequest, spotId);
		});
		it('detailSnsPost가 null값이 아니면 정상이라고 판단한다.', async () => {
			const result = await spotsController.getDetailSpot(searchRequest, spotId);
			expect(result.detailSnsPost !== null);
		});
	});
	describe('getSearchSpot function', () => {
		beforeEach(async () => {
			await spotsController.searchSpot(searchRequest);
		});
		it('getSearchSpot이 null값이 아니면 정상이라고 판단한다.', async () => {
			const result = await spotsController.searchSpot(searchRequest);
			expect(result !== null);
		});
	});
});
