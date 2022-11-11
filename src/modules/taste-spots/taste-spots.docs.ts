import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { TasteSpotsResponseDto } from './dto/taste-spots-response.dto';
import { TasteSpotsController } from './taste-spots.controller';

export const ApiDocs: SwaggerMethodDoc<TasteSpotsController> = {
	getTasteSpots(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 취향 선택 리스트 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [TasteSpotsResponseDto],
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
