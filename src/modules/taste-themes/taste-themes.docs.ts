import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { TasteThemesResponseDto } from './dto/taste-themes-response.dto';
import { TasteThemesController } from './taste-themes.controller';

export const ApiDocs: SwaggerMethodDoc<TasteThemesController> = {
	getTasteThemes(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '테마 취향 선택 리스트 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [TasteThemesResponseDto],
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
