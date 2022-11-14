import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { LocationRequestDto } from './dto/location-request.dto';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { FiltersResponseDto } from './dto/filters-response.dto';
import { FiltersController } from './filters.controller';

export const ApiDocs: SwaggerMethodDoc<FiltersController> = {
	createLocation(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '위치 정보 생성',
			}),
			ApiBody({
				type: LocationRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
		);
	},
	createTheme(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '테마 정보 생성',
			}),
			ApiBody({
				type: ThemeRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
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
				type: FiltersResponseDto,
			}),
		);
	},
};
