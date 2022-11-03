import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AdFormsController } from './ad-forms.controller';

export const ApiDocs: SwaggerMethodDoc<AdFormsController> = {
	registerAdForm(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 요청 등록',
			}),
			ApiResponse({
				status: 201,
				description: '',
				// type: UserResponseDto,
			}),
		);
	},
};
