import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { UserResponseDto } from './dto/user-response.dto';
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
};
