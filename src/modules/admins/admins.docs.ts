import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AdsResponseDto } from './dto/ads-response.dto';
import { GetAdResponseDto } from './dto/get-ad-response.dto';
import { AdFormsResponseDto } from './dto/ad-forms-response.dto';
import { GetAdFormResponseDto } from './dto/get-ad-form.response.dto';
import { GetAdFilterResponseDto } from './dto/get-ad-filter-response.dto';
import { AdminsController } from './admins.controller';

export const ApiDocs: SwaggerMethodDoc<AdminsController> = {
	getAllAdForms(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 요청 목록 반환',
			}),
			ApiQuery({
				name: 'status',
				required: false,
				description: '광고 요청 상태 기준 (신청: Todo, 승인: Approve, 거부: Reject)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [AdFormsResponseDto],
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getAdForm(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 요청 상세 페이지',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: GetAdFormResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	changeAdsStatus(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 요청 상태 변경',
			}),
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						status: {
							description: '광고 요청 상태 기준 (신청: Todo, 승인: Approve, 거부: Reject)',
						},
					},
				},
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	deleteAdForm(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 요청 삭제',
			}),
			ApiResponse({
				status: 204,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
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
	getAllAds(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 목록 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [AdsResponseDto],
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getAds(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 상세 페이지',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: GetAdResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	registerAds(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 등록',
			}),
			ApiConsumes('multipart/form-data'),
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						businessName: {
							type: 'string',
						},
						email: {
							type: 'string',
						},
						pageUrl: {
							type: 'string',
						},
						locationId: {
							type: 'number',
						},
						file: {
							type: 'string',
							format: 'binary',
						},
					},
				},
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	updateAds(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 수정',
			}),
			ApiConsumes('multipart/form-data'),
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						businessName: {
							type: 'string',
						},
						email: {
							type: 'string',
						},
						pageUrl: {
							type: 'string',
						},
						locationId: {
							type: 'number',
						},
						file: {
							type: 'string',
							format: 'binary',
						},
					},
				},
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	deleteAds(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광고 삭제',
			}),
			ApiResponse({
				status: 204,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
