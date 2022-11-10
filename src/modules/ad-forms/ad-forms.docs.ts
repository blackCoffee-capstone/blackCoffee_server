import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AdFormsController } from './ad-forms.controller';
import { AdFormsRequestDto } from './dto/ad-forms-request.dto';
import { AdFormsResponseDto } from './dto/ad-forms-response.dto';

export const ApiDocs: SwaggerMethodDoc<AdFormsController> = {
	registerAdForm(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 요청 등록',
			}),
			ApiBody({
				type: AdFormsRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: AdFormsResponseDto,
			}),
		);
	},
};
