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
import { UserType } from 'src/types/users.types';
import { HashPassword } from '../auth/hash-password';
import { ChangePwRequestDto } from './dto/change-pw-request.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(TasteTheme)
		private readonly tasteThemesRepository: Repository<TasteTheme>,
		@InjectRepository(Theme)
		private readonly themesRepository: Repository<Theme>,
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
}
