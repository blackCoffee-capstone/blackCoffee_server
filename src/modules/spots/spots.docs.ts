import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { boolean } from 'joi';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';
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
				type: SearchRequestDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [SearchResponseDto],
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
				type: DetailSpotRequestDto,
			}),
			ApiParam({
				name: 'spodId',
				type: Number,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: DetailSpotResponseDto,
			}),
		);
	},
};
