import { BadRequestException, NotFoundException } from '@nestjs/common';
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
	let spotsRepository: MockSpotsRepository;

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
		spotsRepository = module.get(getRepositoryToken(Spot));
	});

	it('should be defined', () => {
		expect(wishesController).toBeDefined();
	});
	describe('wishSpot()', () => {
		it('여행지 찜하기 등록을 한다.', async () => {
			const spot = await spotsRepository.find();
			const wishSpot = await wishSpotsRepository.find();
			spotsRepository.createQueryBuilder().getOne.mockResolvedValue(spot);
			wishSpotsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			wishSpotsRepository.create.mockResolvedValue(wishSpot);
			wishSpotsRepository.createQueryBuilder().save.mockResolvedValue(wishSpot);

			await expect(
				wishesController.wishSpot(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ spotId: 1, isWish: true },
				),
			).resolves.toEqual(true);
		});
		it('여행지 찜하기 취소를 한다.', async () => {
			const spot = await spotsRepository.find();
			const wishSpot = await wishSpotsRepository.find();
			spotsRepository.createQueryBuilder().getOne.mockResolvedValue(spot);
			wishSpotsRepository.createQueryBuilder().getOne.mockResolvedValue(wishSpot);
			wishSpotsRepository.create.mockResolvedValue(wishSpot);
			wishSpotsRepository.createQueryBuilder().save.mockResolvedValue(wishSpot);

			await expect(
				wishesController.wishSpot(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ spotId: 1, isWish: false },
				),
			).resolves.toEqual(true);
		});
		it('여행지가 없다면 NotFoundException 에러를 반환한다.', async () => {
			const wishSpot = await wishSpotsRepository.find();
			spotsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			wishSpotsRepository.createQueryBuilder().getOne.mockResolvedValue(wishSpot);
			wishSpotsRepository.create.mockResolvedValue(wishSpot);
			wishSpotsRepository.createQueryBuilder().save.mockResolvedValue(wishSpot);

			await expect(
				wishesController.wishSpot(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ spotId: 1, isWish: true },
				),
			).rejects.toThrow(NotFoundException);
		});
		it('이미 찜하기를 했다면 BadRequestException 에러를 반환한다.', async () => {
			const spot = await spotsRepository.find();
			const wishSpot = await wishSpotsRepository.find();
			spotsRepository.createQueryBuilder().getOne.mockResolvedValue(spot);
			wishSpotsRepository.createQueryBuilder().getOne.mockResolvedValue(wishSpot);
			wishSpotsRepository.create.mockResolvedValue(wishSpot);
			wishSpotsRepository.createQueryBuilder().save.mockResolvedValue(wishSpot);

			await expect(
				wishesController.wishSpot(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ spotId: 1, isWish: true },
				),
			).rejects.toThrow(BadRequestException);
		});
		it('이미 찜하기를 하지 않았다면 BadRequestException 에러를 반환한다.', async () => {
			const spot = await spotsRepository.find();
			const wishSpot = await wishSpotsRepository.find();
			spotsRepository.createQueryBuilder().getOne.mockResolvedValue(spot);
			wishSpotsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			wishSpotsRepository.create.mockResolvedValue(wishSpot);
			wishSpotsRepository.createQueryBuilder().save.mockResolvedValue(wishSpot);

			await expect(
				wishesController.wishSpot(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ spotId: 1, isWish: false },
				),
			).rejects.toThrow(BadRequestException);
		});
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
