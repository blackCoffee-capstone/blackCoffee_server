import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Spot } from 'src/entities/spots.entity';
import { TasteSpot } from 'src/entities/taste-spots.entity';
import { User } from 'src/entities/users.entity';
import { UserType } from 'src/types/users.types';
import { HashPassword } from '../auth/hash-password';
import { ChangePwRequestDto } from './dto/change-pw-request.dto';
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

	async createUsersTasteSpots(userId: number, tasteSpots: number[]): Promise<boolean> {
		const isUsersTasteSpots = await this.tasteSpotsRepository.findOne({
			where: { userId },
		});
		if (this.isDuplicateArr(tasteSpots)) {
			throw new BadRequestException(`Duplicate value exists in user's taste list`);
		}
		if (isUsersTasteSpots) {
			throw new BadRequestException(`User's taste is already exist`);
		}
		if (await this.notFoundSpots(tasteSpots)) {
			throw new NotFoundException('Spot is not found');
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

	private isDuplicateArr(arr: any): boolean {
		const set = new Set(arr);

		if (arr.length !== set.size) return true;
		return false;
	}
	private async notFoundSpots(spots: number[]): Promise<boolean> {
		const foundSpots = await this.spotsRepository
			.createQueryBuilder('spot')
			.where('spot.id IN (:...spotIds)', { spotIds: spots })
			.getMany();

		if (foundSpots.length !== spots.length) return true;
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
}
