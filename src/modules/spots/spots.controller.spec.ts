import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';
import { ClickSpot } from 'src/entities/click-spots.entity';
import { Location } from 'src/entities/locations.entity';
import { Rank } from 'src/entities/rank.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { MockClickSpotsRepository } from 'test/mock/click-spots.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockSnsPostsRepository } from 'test/mock/snsPosts.mock';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { MockWishSpotsRepository } from 'test/mock/wish-spots.mock';
import { KakaoAuthStrategy } from '../auth/strategies/kakao-auth.strategy';
import { RanksService } from '../ranks/ranks.service';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';

describe('SpotsController', () => {
	let spotsController: SpotsController;
	let spotsService: SpotsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			controllers: [SpotsController],
			providers: [
				SpotsService,
				{
					provide: JwtService,
					useValue: {
						sign: () => '',
					},
				},
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
				{
					provide: getRepositoryToken(SnsPost),
					useClass: MockSnsPostsRepository,
				},
				{
					provide: getRepositoryToken(Rank),
					useClass: MockSnsPostsRepository,
				},
				{
					provide: getRepositoryToken(ClickSpot),
					useClass: MockClickSpotsRepository,
				},
				{
					provide: getRepositoryToken(WishSpot),
					useClass: MockWishSpotsRepository,
				},
				KakaoAuthStrategy,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'oauthConfig' || key === 'jwtConfig') {
								return 1;
							}
							return null;
						}),
					},
				},
				RanksService,
			],
		}).compile();

		spotsController = module.get<SpotsController>(SpotsController);
		spotsService = module.get<SpotsService>(SpotsService);
	});
	it('should be defined', () => {
		expect(spotsController).toBeDefined();
	});
});
