import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { UserType } from 'src/types/users.types';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockWishSpotsRepository } from 'test/mock/wish-spots.mock';
import { UserWishesDto } from './dto/user-wishes.dto';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';

describe('WishesController', () => {
	let wishesController: WishesController;
	let wishSpotsRepository: MockWishSpotsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [WishesController],
			providers: [
				WishesService,
				{
					provide: getRepositoryToken(WishSpot),
					useClass: MockWishSpotsRepository,
				},
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
				},
			],
		}).compile();

		wishesController = module.get<WishesController>(WishesController);
		wishSpotsRepository = module.get(getRepositoryToken(WishSpot));
	});

	it('should be defined', () => {
		expect(wishesController).toBeDefined();
	});
	describe('getUsersWishes()', () => {
		it('사용자의 찜목록을 반환한다.', async () => {
			const wishSpots = await wishSpotsRepository.find();
			const expectWishSpots = wishSpots.map((item) => new UserWishesDto(item));
			wishSpotsRepository.createQueryBuilder().getMany.mockResolvedValue([
				{
					spot: {
						id: 1,
						name: 'test',
						address: '부산 해운대구',
						clickSpots: [1],
						wishSpots: [1],
						snsPosts: [{ photoUrl: 'test' }],
					},
				},
			]);

			await expect(
				wishesController.getUsersWishes(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ page: 1, take: 10 },
				),
			).resolves.toEqual({
				totalPage: 1,
				totalWishSpots: 1,
				wishSpots: expectWishSpots,
			});
		});
	});
});
