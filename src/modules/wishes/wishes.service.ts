import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { Repository } from 'typeorm';
import { UserMyPageRequestDto } from '../users/dto/user-mypage-request.dto';
import { UserWishesResponseDto } from './dto/user-wishes-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';

@Injectable()
export class WishesService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(WishSpot)
		private readonly wishSpotsRepository: Repository<WishSpot>,
	) {}

	async wishSpot(userId: number, spotId: number, isWish: boolean): Promise<boolean> {
		const IsSpot = await this.spotsRepository
			.createQueryBuilder('spot')
			.where('spot.id = :spotId', { spotId })
			.getOne();
		if (!IsSpot) throw new NotFoundException('Spot is not found');

		const isWishSpot = await this.wishSpotsRepository
			.createQueryBuilder('wishSpot')
			.where('wishSpot.userId = :userId', { userId })
			.andWhere('wishSpot.spotId = :spotId', { spotId })
			.getOne();

		if (isWish && isWishSpot) throw new BadRequestException('User already wishes spot');
		else if (!isWish && !isWishSpot) throw new BadRequestException('User already no wishes spot');
		else if (isWish && !isWishSpot) {
			const wishSpot = this.wishSpotsRepository.create({
				userId,
				spotId,
			});
			await this.wishSpotsRepository.save(wishSpot);
		} else if (!isWish && isWishSpot) {
			await this.wishSpotsRepository.delete({
				userId,
				spotId,
			});
		}
		return true;
	}

	async getUsersWishes(userId: number, wishPageData: UserMyPageRequestDto): Promise<UserWishesResponseDto> {
		try {
			const wishes = this.wishSpotsRepository
				.createQueryBuilder('wishSpot')
				.leftJoinAndSelect('wishSpot.user', 'user')
				.leftJoinAndSelect('wishSpot.spot', 'spot')
				.leftJoinAndSelect('spot.clickSpots', 'clickSpots')
				.leftJoinAndSelect('spot.wishSpots', 'wishSpots')
				.leftJoinAndSelect('spot.snsPosts', 'snsPosts')
				.where('snsPosts.photoUrl is not null')
				.andWhere('user.id = :userId', { userId })
				.orderBy('wishSpot.created_at', 'DESC');

			const totalPageWishes = await wishes.getMany();
			const responseWishes = await wishes
				.limit(wishPageData.take)
				.offset((wishPageData.page - 1) * wishPageData.take)
				.getMany();

			const totalPage = Math.ceil(totalPageWishes.length / wishPageData.take);
			const wishesDto = Array.from(responseWishes).map(
				(wish) =>
					new UserWishesDto({
						id: wish.spot.id,
						name: wish.spot.name,
						address: wish.spot.address,
						views: wish.spot.clickSpots.length,
						wishes: wish.spot.wishSpots.length,
						isWish: true,
						photoUrl: wish.spot.snsPosts[0].photoUrl,
					}),
			);
			return new UserWishesResponseDto({
				totalPage: totalPage,
				totalWishSpots: totalPageWishes.length,
				wishSpots: wishesDto,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
