import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { LocalLocationResponseDto } from './dto/local-location-response.dto';
import { MetroLocationResponseDto } from './dto/metro-location-response.dto';
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
	createMetroLocation(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '광역자치단체 위치 정보 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: MetroLocationResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getAllMetroLocation(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '모든 광역자치단체 위치 정보 반환',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createLocalLocation(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '지역자치단체 위치 정보 생성',
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: LocalLocationResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getAllLocalLocation(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '모든 지역자치단체 위치 정보 반환',
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
