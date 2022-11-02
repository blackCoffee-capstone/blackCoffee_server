import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/users.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async getUser(id: number): Promise<UserResponseDto> {
		const user = await this.usersRepository.findOne({
			where: { id },
		});
		return new UserResponseDto(user);
	}
}
