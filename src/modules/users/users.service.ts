import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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

	async findAllUsers(id: number) {
		const user = await this.usersRepository.findOne({
			where: { id },
		});
		return user;
	}
}
