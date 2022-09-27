import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiDocs } from './users.docs';
import { UsersService } from './users.service';

@ApiTags('users - 사용자 정보')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiDocs.create('사용자 생성')
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get('/:id')
	@ApiDocs.findAllUsers('전체 사용자 정보 조회')
	public async findAllUsers(@Param('id') id: number) {
		return this.usersService.findAllUsers(id);
	}
}
