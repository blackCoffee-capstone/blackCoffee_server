import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { SearchResponseDto } from '../spots/dto/search-response.dto';
import { RecommendationsMapResponseDto } from './dto/recommendations-map-response.dto';
import { RecommendationsController } from './recommendations.controller';

export const ApiDocs: SwaggerMethodDoc<RecommendationsController> = {
	updateMlRecommendations(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '추천 모델 훈련 (일주일에 한번)',
			}),
			ApiResponse({
				status: 201,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
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
			ApiBearerAuth('Authorization'),
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
			ApiBearerAuth('Authorization'),
		);
	},
};
