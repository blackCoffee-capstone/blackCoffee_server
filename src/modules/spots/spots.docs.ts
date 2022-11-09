import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { SnsPostResponseDto } from './dto/sns-post-response.dto';
import { SpotResponseDto } from './dto/spot-response.dto';
import { ThemeResponseDto } from './dto/theme-response.dto';
import { SpotsController } from './spots.controller';

export const ApiDocs: SwaggerMethodDoc<SpotsController> = {
	createSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 정보 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: SpotResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createLocation(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '위치 정보 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: LocationResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getAllLocation(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '모든 위치 정보 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createTheme(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '테마 정보 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: ThemeResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getAllTheme(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '모든 테마 정보 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createSnsPost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: 'sns post 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: SnsPostResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getAllSnsPost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '모든 sns post 정보 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	searchSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 검색(단어 검색, 정렬, 필터링, 페이지네이션)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: SearchResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getDetailSpot(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '여행지 상세 페이지(여행지 기본 정보, 연관 sns posts',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: DetailSpotResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
