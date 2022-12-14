import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { ChangePwRequestDto } from './dto/change-pw-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserPostsResponseDto } from './dto/user-posts-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserTasteThemesRequestDto } from './dto/user-taste-themes-request.dto';
import { UsersController } from './users.controller';

export const ApiDocs: SwaggerMethodDoc<UsersController> = {
	getUser(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자 정보 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: UserResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	updateUser(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자 정보 변경 (이름,닉네임)',
			}),
			ApiBody({
				type: UpdateUserRequestDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createUsersTasteThemes(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자의 테마 취향 저장',
			}),
			ApiBody({
				type: UserTasteThemesRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getUsersTasteThemes(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자의 테마 취향 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	updateUsersPw(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자 비밀번호 변경',
			}),
			ApiBody({
				type: ChangePwRequestDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getUsersPosts(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자의 게시글 목록 반환',
			}),
			ApiQuery({
				name: 'page',
				required: false,
				description: '페이지 번호 (default=1)',
			}),
			ApiQuery({
				name: 'take',
				required: false,
				description: '페이지 별 데이터 개수 (default=10)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: UserPostsResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
