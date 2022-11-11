import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Spot } from 'src/entities/spots.entity';
import { TasteSpot } from 'src/entities/taste-spots.entity';
import { User } from 'src/entities/users.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(TasteSpot)
		private readonly tasteSpotsRepository: Repository<TasteSpot>,
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
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

	async createUsersTasteSpots(userId: number, tasteSpots: number[]): Promise<boolean> {
		const isUsersTasteSpots = await this.tasteSpotsRepository.findOne({
			where: { userId },
		});
		if (this.IsDuplicateArr(tasteSpots)) {
			throw new BadRequestException(`Duplicate value exists in user's taste list`);
		}
		if (isUsersTasteSpots) {
			throw new BadRequestException(`User's taste is already exist`);
		}
		try {
			const usersTasteSpots = [];
			for (let i = 0; i < tasteSpots.length; i++) {
				usersTasteSpots.push({
					userId: userId,
					spotId: tasteSpots[i],
				});
			}

			await this.tasteSpotsRepository
				.createQueryBuilder('taste_spot')
				.insert()
				.into(TasteSpot)
				.values(usersTasteSpots)
				.execute();
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private IsDuplicateArr(arr: any): boolean {
		const set = new Set(arr);

		if (arr.length !== set.size) return true;
		return false;
	}
}
