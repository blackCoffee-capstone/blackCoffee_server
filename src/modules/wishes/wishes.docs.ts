import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { UserWishesResponseDto } from './dto/user-wishes-response.dto';
import { WishSpotRequestDto } from './dto/wish-spot-request.dto';
import { WishesController } from './wishes.controller';

export const ApiDocs: SwaggerMethodDoc<WishesController> = {
	wishSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 찜하기',
			}),
			ApiBody({
				type: WishSpotRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getUsersWishes(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자의 찜 목록 반환',
			}),
			ApiQuery({
				name: 'page',
				required: false,
				description: '페이지 번호 (default=1)',
			}),
			ApiQuery({
				name: 'take',
				required: false,
				description: '페이지 별 데이터 개수 (default=10)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: UserWishesResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
