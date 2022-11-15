import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { FiltersResponseDto } from './dto/filters-response.dto';
import { FiltersController } from './filters.controller';

export const ApiDocs: SwaggerMethodDoc<FiltersController> = {
	filterList(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '필터링 목록 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: FiltersResponseDto,
			}),
		);
	},
};
