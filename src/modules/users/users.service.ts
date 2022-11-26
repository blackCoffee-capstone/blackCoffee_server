import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TasteTheme } from 'src/entities/taste-themes.entity';
import { Theme } from 'src/entities/theme.entity';
import { User } from 'src/entities/users.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { UserType } from 'src/types/users.types';
import { HashPassword } from '../auth/hash-password';
import { UsersTasteThemesResponseDto } from '../taste-themes/dto/users-taste-themes-response.dto';
import { ChangePwRequestDto } from './dto/change-pw-request.dto';
import { UserMyPageRequestDto } from './dto/user-mypage-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserWishesResponseDto } from './dto/user-wishes-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(TasteTheme)
		private readonly tasteThemesRepository: Repository<TasteTheme>,
		@InjectRepository(Theme)
		private readonly themesRepository: Repository<Theme>,
		@InjectRepository(WishSpot)
		private readonly wishSpotsRepository: Repository<WishSpot>,
		private hashPassword: HashPassword,
	) {}

	async getUser(userId: number): Promise<UserResponseDto> {
		try {
			const user = await this.usersRepository.findOne({
				where: { id: userId },
			});
			return new UserResponseDto(user);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async createUsersTasteThemes(userId: number, tasteThemes: number[]): Promise<boolean> {
		const isUsersTasteThemes = await this.tasteThemesRepository.findOne({
			where: { userId },
		});
		if (this.isDuplicateArr(tasteThemes)) {
			throw new BadRequestException(`Duplicate value exists in user's taste list`);
		}
		if (isUsersTasteThemes) {
			throw new BadRequestException(`User's taste is already exist`);
		}
		if (await this.notFoundThemes(tasteThemes)) {
			throw new NotFoundException('Theme is not found');
		}
		try {
			const usersTasteThemes = [];
			for (let i = 0; i < tasteThemes.length; i++) {
				usersTasteThemes.push({
					userId: userId,
					themeId: tasteThemes[i],
				});
			}

			await this.tasteThemesRepository
				.createQueryBuilder('taste_theme')
				.insert()
				.into(TasteTheme)
				.values(usersTasteThemes)
				.execute();

			await this.updateUserIfNewUser(userId);

			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getUsersTasteThemes(userId: number): Promise<UsersTasteThemesResponseDto[]> {
		try {
			//taste
			const foundUsersThemes = await this.tasteThemesRepository
				.createQueryBuilder('taste_theme')
				.select('theme.id, theme.name')
				.leftJoin('taste_theme.user', 'user')
				.leftJoin('taste_theme.theme', 'theme')
				.where('user.id = :id', { id: userId })
				.getRawMany();

			return foundUsersThemes.map((theme) => new UsersTasteThemesResponseDto({ id: theme.id, name: theme.name }));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async updateUsersPw(user, changePwDto: ChangePwRequestDto): Promise<boolean> {
		await this.errIfUpdatePwReqIsBad(user, changePwDto);

		const foundUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.id = :id', { id: user.id })
			.getOne();

		if (!(await this.isValidPassword(foundUser.password, changePwDto.originPw))) {
			throw new UnauthorizedException('Password is incorrect');
		}
		foundUser.password = await this.hashPassword.hash(changePwDto.newPw);
		await this.usersRepository.update(user.id, foundUser);

		return true;
	}

	async getUserswishes(userId: number, wishPageData: UserMyPageRequestDto): Promise<UserWishesResponseDto> {
		try {
			const wishes = this.wishSpotsRepository
				.createQueryBuilder('wishSpot')
				.leftJoinAndSelect('wishSpot.user', 'user')
				.leftJoinAndSelect('wishSpot.spot', 'spot')
				.leftJoinAndSelect('spot.clickSpots', 'clickSpots')
				.leftJoinAndSelect('spot.wishSpots', 'wishSpots')
				.where('user.id = :userId', { userId })
				.orderBy('wishSpot.created_at', 'DESC');

			const totalPageWishes = await wishes.getMany();
			const responseWishes = await wishes
				.limit(wishPageData.take)
				.offset((wishPageData.page - 1) * wishPageData.take)
				.getMany();

			const totalPage = Math.ceil(totalPageWishes.length / wishPageData.take);
			const wishesDto = Array.from(responseWishes).map(
				(post) =>
					new UserWishesDto({
						id: post.spot.id,
						name: post.spot.name,
						address: post.spot.address,
						views: post.spot.clickSpots.length,
						wishes: post.spot.wishSpots.length,
						isWish: true,
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

	private isDuplicateArr(arr: any): boolean {
		const set = new Set(arr);

		if (arr.length !== set.size) return true;
		return false;
	}
	private async notFoundThemes(themes: number[]): Promise<boolean> {
		const foundThemes = await this.themesRepository
			.createQueryBuilder('theme')
			.where('theme.id IN (:...themeIds)', { themeIds: themes })
			.getMany();

		if (foundThemes.length !== themes.length) return true;
		return false;
	}

	private async errIfUpdatePwReqIsBad(user, changePwDto: ChangePwRequestDto) {
		if (user.role === UserType.Kakao) {
			throw new BadRequestException('User is kakao user');
		} else if (user.role === UserType.Facebook) {
			throw new BadRequestException('User is facebook user');
		} else if (changePwDto.originPw === changePwDto.newPw) {
			throw new BadRequestException('originPw and newPw are the same');
		}
	}

	private async isValidPassword(original: string, target: string) {
		return await this.hashPassword.equal({ password: target, hashPassword: original });
	}

	private async updateUserIfNewUser(userId: number) {
		await this.usersRepository.update(userId, {
			isNewUser: false,
		});
		return true;
	}
}
