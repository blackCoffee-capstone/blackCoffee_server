import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from './users.docs';
import { UsersService } from './users.service';

@ApiTags('users - 사용자 정보')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiDocs.findAllUsers('전체 사용자 정보 조회')
	public async findAllUsers() {
		return this.usersService.findAllUsers();
	}
}
