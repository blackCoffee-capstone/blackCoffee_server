import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { FiltersController } from './filters.controller';

export const ApiDocs: SwaggerMethodDoc<FiltersController> = {
	createLocation(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '위치 정보 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createTheme(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '테마 정보 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	filterList(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '필터링 목록 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
