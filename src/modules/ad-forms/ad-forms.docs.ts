import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AdFormsController } from './ad-forms.controller';

export const ApiDocs: SwaggerMethodDoc<AdFormsController> = {
	registerAdForm(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 요청 등록',
			}),
			ApiConsumes('multipart/form-data'), //TODO: form-data안에 json 넣는 방식으로 추후 수정 예정
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						businessName: {
							type: 'string',
						},
						address: {
							type: 'string',
						},
						email: {
							type: 'string',
						},
						phoneNumber: {
							type: 'string',
						},
						requirement: {
							type: 'string',
						},
						file: {
							type: 'string',
							format: 'binary',
						},
					},
				},
			}),

			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
		);
	},
};
