import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiDocs } from './users.docs';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users - 사용자 정보')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiDocs.create('사용자 생성')
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	@ApiDocs.getUser('사용자 정보 반환')
	async getUser(@AuthUser() userData) {
		return await this.usersService.getUser(userData.id);
	}
}
