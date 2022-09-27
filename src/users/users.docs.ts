import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';

import { UsersController } from './users.controller';

export const ApiDocs: SwaggerMethodDoc<UsersController> = {
	findAllUsers(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '모든 사용자 조회',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: String,
			}),
		);
	},
};
