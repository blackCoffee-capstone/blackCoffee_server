import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/types/users.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { ChangePwRequestDto } from './dto/change-pw-request.dto';
import { UserTasteSpotsRequestDto } from './dto/user-taste-spots-request.dto';
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

	@Post('/taste-spots')
	@ApiDocs.createUsersTasteSpots('사용자의 여행지 취향 저장')
	async createUsersTasteSpots(@AuthUser() userData, @Body() tasteSpotsDto: UserTasteSpotsRequestDto) {
		return await this.usersService.createUsersTasteSpots(userData.id, tasteSpotsDto.tasteSpots);
	}

	@Patch('/change-pw')
	@ApiDocs.updateUsersPw('사용자 비밀번호 변경')
	async updateUsersPw(@AuthUser() userData, @Body() changePwDto: ChangePwRequestDto) {
		return await this.usersService.updateUsersPw(userData, changePwDto);
	}
}
