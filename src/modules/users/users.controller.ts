import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/types/users.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { ChangePwRequestDto } from './dto/change-pw-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserMyPageRequestDto } from './dto/user-mypage-request.dto';
import { UserTasteThemesRequestDto } from './dto/user-taste-themes-request.dto';
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

	@Patch()
	@ApiDocs.updateUser('사용자 정보 변경 (이름, 닉네임)')
	async updateUser(@AuthUser() userData, @Body() updateUserDto: UpdateUserRequestDto) {
		return await this.usersService.updateUser(userData.id, updateUserDto);
	}

	@Get('/admin-test')
	@UseGuards(RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.adminTest('관리자 전용 api 테스트')
	async adminTest(@AuthUser() userData) {
		return 'User is Admin';
	}

	@Post('/taste-themes')
	@ApiDocs.createUsersTasteThemes('사용자의 테마 취향 저장')
	async createUsersTasteThemes(@AuthUser() userData, @Body() tasteThemesDto: UserTasteThemesRequestDto) {
		return await this.usersService.createUsersTasteThemes(userData.id, tasteThemesDto.tasteThemes);
	}

	@Get('/taste-themes')
	@ApiDocs.getUsersTasteThemes('사용자의 테마 취향 반환')
	async getUsersTasteThemes(@AuthUser() userData) {
		return await this.usersService.getUsersTasteThemes(userData.id);
	}

	@Patch('/change-pw')
	@ApiDocs.updateUsersPw('사용자 비밀번호 변경')
	async updateUsersPw(@AuthUser() userData, @Body() changePwDto: ChangePwRequestDto) {
		return await this.usersService.updateUsersPw(userData, changePwDto);
	}

	@Get('/wishes')
	@ApiDocs.getUsersWishes('사용자의 찜 목록 반환')
	async getUsersWishes(@AuthUser() userData, @Query() usersWishes: UserMyPageRequestDto) {
		return await this.usersService.getUsersWishes(userData.id, usersWishes);
	}

	@Get('/likes')
	@ApiDocs.getUsersLikes('사용자의 좋아요 목록 반환')
	async getUsersLikes(@AuthUser() userData, @Query() usersLikes: UserMyPageRequestDto) {
		return await this.usersService.getUsersLikes(userData.id, usersLikes);
	}

	@Get('/posts')
	@ApiDocs.getUsersPosts('사용자의 게시글 목록 반환')
	async getUsersPosts(@AuthUser() userData, @Query() usersPosts: UserMyPageRequestDto) {
		return await this.usersService.getUsersPosts(userData.id, usersPosts);
	}
}
