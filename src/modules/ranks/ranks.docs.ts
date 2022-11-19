import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { RankingRequestDto } from './dto/ranking-request.dto';
import { RankingListResponseDto } from './dto/ranking-list-response.dto';
import { RankingMapResponseDto } from './dto/ranking-map-response.dto';
import { RanksController } from './ranks.controller';

export const ApiDocs: SwaggerMethodDoc<RanksController> = {
	ranksList(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '최신 트렌드 랭킹 페이지 리스트 기준',
			}),
			ApiQuery({
				type: RankingRequestDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [RankingListResponseDto],
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
				type: RankingRequestDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: RankingMapResponseDto,
			}),
		);
	},
};
