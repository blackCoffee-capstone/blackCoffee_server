import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { RankingResponseDto } from './dto/ranking-response.dto';
import { RanksController } from './ranks.controller';

export const ApiDocs: SwaggerMethodDoc<RanksController> = {
	ranksList(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '최신 트렌드 랭킹 페이지 리스트 기준',
			}),
			ApiQuery({
				name: 'date',
				required: false,
				description: '날짜(연도 + 월 + 주차)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: RankingResponseDto,
			}),
		);
	},
	ranksMap(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '최신 트렌드 랭킹 페이지 지도 기준',
			}),
			ApiQuery({
				name: 'date',
				required: false,
				description: '날짜(연도 + 월 + 주차)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: RankingResponseDto,
			}),
		);
	},
};
