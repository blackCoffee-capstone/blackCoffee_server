import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
				description: '정렬 기준 (조회순: View, 인기순: Wish, 랭킹순: Rank)',
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
				type: String,
			}),
			ApiQuery({
				name: 'themeIds',
				required: false,
				description: '테마 필터링 id list',
				type: String,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: SearchPageResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	updateSnsPostPhotos(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: 'sns post의 photourl 업데이트 (유효기간때문)',
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
	getSnsPostUrls(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: 'sns post url들 파일(test.txt)로 출력 (테스트위해)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	mltest(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: 'sns post url들 파일(test.txt)로 출력 (테스트위해)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: Boolean,
			}),
		);
	},
};
