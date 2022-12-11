import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AdsController } from './ads.controller';
import { ClickAdsRequestDto } from './dto/click-ads-request.dto';
import { GetAdFilterResponseDto } from './dto/get-ad-filter-response.dto';

export const ApiDocs: SwaggerMethodDoc<AdsController> = {
	getAdsFilter(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '게시용 광고 목록 반환',
			}),
			ApiQuery({
				name: 'locationIds',
				required: false,
				description: '위치 필터링 id list',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [GetAdFilterResponseDto],
			}),
		);
	},
	clickAds(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 클릭하면 클릭횟수 증가',
			}),
			ApiBody({
				type: ClickAdsRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
		);
	},
};
