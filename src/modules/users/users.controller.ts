import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/types/users.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { ApiDocs } from './users.docs';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users - 사용자 정보')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiDocs.getUser('사용자 정보 반환')
	async getUser(@AuthUser() userData) {
		return await this.usersService.getUser(userData.id);
	}

	@Get('/admin-test')
	@UseGuards(RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.adminTest('관리자 전용 api 테스트')
	async adminTest(@AuthUser() userData) {
		return 'User is Admin';
	}
}
