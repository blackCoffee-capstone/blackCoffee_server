import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { SpotsController } from './spots.controller';

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
		);
	},
	createSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 정보 생성',
			}),
			ApiBody({
				type: SpotRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
		);
	},
	createSnsPost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: 'sns post 생성',
			}),
			ApiBody({
				type: SnsPostRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
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
