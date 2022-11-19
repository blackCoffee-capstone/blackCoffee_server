import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { RecommendationsController } from './recommendations.controller';

export const ApiDocs: SwaggerMethodDoc<RecommendationsController> = {
	recommendationsSpotsList(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '추천 여행지 페이지 리스트 기준',
			}),
			ApiResponse({
				status: 200,
				description: '',
				// type: [RankingListResponseDto],
			}),
		);
	},
	recommendationsSpotsMap(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '추천 여행지 페이지 지도 기준',
			}),
			ApiResponse({
				status: 200,
				description: '',
				// type: RankingMapResponseDto,
			}),
		);
	},
};
