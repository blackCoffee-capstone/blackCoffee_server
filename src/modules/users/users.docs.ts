import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { UserResponseDto } from './dto/user-response.dto';
import { UserTasteSpotsRequestDto } from './dto/user-taste-spots-request.dto';
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
	adminTest(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '관리자 전용 api 테스트',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createUsersTasteSpots(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자의 여행지 취향 저장',
			}),
			ApiBody({
				type: UserTasteSpotsRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
