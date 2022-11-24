import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { boolean } from 'joi';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { SearchPageResponseDto } from './dto/search-page-response.dto';
import { SpotsController } from './spots.controller';

export const ApiDocs: SwaggerMethodDoc<SpotsController> = {
	createSpots(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: 'csv 파일 속 데이터를 DB에 저장 & Sns, Rank 저장 및 업데이트',
			}),
			ApiConsumes('multipart/form-data'),
			ApiBody({
				schema: {
					type: 'object',
					properties: {
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
				type: boolean,
			}),
		);
	},
	searchSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 검색(단어 검색, 정렬, 필터링, 페이지네이션)',
			}),
			ApiQuery({
				name: 'word',
				required: false,
				description: '검색어',
			}),
			ApiQuery({
				name: 'sorter',
				required: false,
				description: '정렬 기준 (이름순: Name, 인기순: Rank)',
			}),
			ApiQuery({
				name: 'page',
				required: false,
				description: '페이지 번호',
			}),
			ApiQuery({
				name: 'take',
				required: false,
				description: '페이지 별 데이터 개수',
			}),
			ApiQuery({
				name: 'locationIds',
				required: false,
				description: '위치 필터링 id list',
			}),
			ApiQuery({
				name: 'themeIds',
				required: false,
				description: '테마 필터링 id list',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: SearchPageResponseDto,
			}),
		);
	},
	detailSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 상세 페이지(여행지 기본 정보, 연관 sns posts',
			}),
			ApiQuery({
				name: 'take',
				required: false,
				description: '페이지 별 데이터 개수',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: DetailSpotResponseDto,
			}),
		);
	},
	wishSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 찜하기',
			}),
			ApiParam({
				name: 'spotId',
				type: Number,
			}),
			ApiParam({
				name: 'isWish',
				type: Boolean,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
