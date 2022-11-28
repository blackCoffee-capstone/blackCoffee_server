import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { ReportsResponseDto } from './dto/reports-response.dto';
import { UpdateMultiReportsRequestDto } from './dto/update-multi-reports-request.dto';
import { UpdateReportsRequestDto } from './dto/update-reports-request.dto';
import { ReportPostsController } from './report-posts.controller';

export const ApiDocs: SwaggerMethodDoc<ReportPostsController> = {
	getAllReports(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '신고 목록 반환',
			}),
			ApiQuery({
				name: 'status',
				required: false,
				description: '신고 상태',
			}),
			ApiQuery({
				name: 'postId',
				required: false,
				description: '커뮤니티 게시글 id',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [ReportsResponseDto],
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	updateMultiReportsStatus(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여러 신고 상태 수정하기',
			}),
			ApiBody({
				type: UpdateMultiReportsRequestDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
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
				status: 200,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	deleteReports(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '신고 삭제하기',
			}),
			ApiParam({
				name: 'reportId',
				type: Number,
			}),
			ApiResponse({
				status: 204,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
