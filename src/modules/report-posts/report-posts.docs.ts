import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { UpdateReportsRequestDto } from './dto/update-reports-request.dto';
import { ReportPostsController } from './report-posts.controller';

export const ApiDocs: SwaggerMethodDoc<ReportPostsController> = {
	updateReportsStatus(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '신고 상태 수정하기',
			}),
			ApiParam({
				name: 'reportId',
				type: Number,
			}),
			ApiBody({
				type: UpdateReportsRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
