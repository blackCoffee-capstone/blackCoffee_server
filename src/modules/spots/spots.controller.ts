import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalLocationRequestDto } from './dto/local-location-request.dto';
import { MetroLocationRequestDto } from './dto/metro-location-request.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { ApiDocs } from './spots.docs';
import { SpotsService } from './spots.service';

@Controller('spots')
@ApiTags('spots - 여행지/위치/테마/SNS Post 정보')
export class SpotsController {
	constructor(private readonly spotsService: SpotsService) {}

	// Test
	@Post()
	@ApiDocs.createSpot('여행지 정보 생성')
	async createSpot(@Body() spot: SpotRequestDto) {
		return await this.spotsService.createSpot(spot);
	}

	// Test
	@Post('/local-location')
	@ApiDocs.createLocalLocation('지역자치단체 위치 정보 생성')
	async createLocalLocation(@Body() localLocation: LocalLocationRequestDto) {
		return await this.spotsService.createLocalLocation(localLocation);
	}

	// Test
	@Get('/local-location')
	@ApiDocs.getAllLocalLocation('모든 지역자치단체 위치 정보 생성')
	async getAllLocalLocation() {
		return await this.spotsService.getAllLocalLocation();
	}

	// Test
	@Post('/metro-location')
	@ApiDocs.createMetroLocation('광역자치단체 위치 정보 생성')
	async createMetroLocation(@Body() metroLocation: MetroLocationRequestDto) {
		return await this.spotsService.createMetroLocation(metroLocation);
	}

	// Test
	@Get('/metro-location')
	@ApiDocs.getAllMetroLocation('모든 광역자치단체 위치 정보 생성')
	async getAllMetroLocation() {
		return await this.spotsService.getAllMetroLocation();
	}

	// Test
	@Post('/theme')
	@ApiDocs.createTheme('테마 정보 생성')
	async createTheme(@Body() theme: ThemeRequestDto) {
		return await this.spotsService.createTheme(theme);
	}

	// Test
	@Get('/theme')
	@ApiDocs.getAllTheme('모든 테마 정보 반환')
	async getAllTheme() {
		return await this.spotsService.getAllTheme();
	}

	// Test
	@Post('/snsPost')
	@ApiDocs.createSnsPost('sns post 생성')
	async createSnsPost(@Body() snsPost: SnsPostRequestDto) {
		return await this.spotsService.createSnsPost(snsPost);
	}

	// Test
	@Get('/snsPost')
	@ApiDocs.getAllSnsPost('모든 sns spot 정보 반환')
	async getAllSnsPost() {
		return await this.spotsService.getAllSnsPost();
	}

	@Get()
	@ApiDocs.searchSpot('여행지 검색(단어 검색, 정렬, 필터링, 페이지네이션)')
	async searchSpot(@Query() searchSpot: SearchRequestDto) {
		return await this.spotsService.getSearchSpot(searchSpot);
	}

	@Get(':spotId')
	@ApiDocs.getDetailSpot('여행지 상세 페이지(여행지 기본 정보, 연관 sns posts')
	async getDetailSpot(@Query() searchSpot: SearchRequestDto, @Param('spotId') spotId: number) {
		return await this.spotsService.getDetailSpot(searchSpot, spotId);
	}
}
