import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { SearchResponseDto } from '../spots/dto/search-response.dto';
import { RecommendationsMapResponseDto } from './dto/recommendations-map-response.dto';
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
				type: [SearchResponseDto],
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
				type: [RecommendationsMapResponseDto],
			}),
		);
	},
};
