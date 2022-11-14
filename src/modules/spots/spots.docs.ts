import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { SpotsController } from './spots.controller';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { SearchResponseDto } from './dto/search-response.dto';

export const ApiDocs: SwaggerMethodDoc<SpotsController> = {
	saveData(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '데이터 저장 및 업데이트',
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 정보 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createSnsPost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: 'sns post 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	searchSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 검색(단어 검색, 정렬, 필터링, 페이지네이션)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: SearchResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	detailSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 상세 페이지(여행지 기본 정보, 연관 sns posts',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: DetailSpotResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
