import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto) {
		const kakaoUser = await this.usersRepository.save(createUserDto);
		return kakaoUser;
	}

	async getUser(id: number): Promise<UserResponseDto> {
		const user = await this.usersRepository.findOne({
			where: { id },
		});
		return new UserResponseDto(user);
	}
}
