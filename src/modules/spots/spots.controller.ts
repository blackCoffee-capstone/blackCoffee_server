import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LocationRequestDto } from './dto/location-request.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
	constructor(private readonly spotsService: SpotsService) {}

	// Test
	@Post()
	async createSpot(@Body() spot: SpotRequestDto) {
		return await this.spotsService.createSpot(spot);
	}

	// Test
	@Post('/location')
	async createLocation(@Body() location: LocationRequestDto) {
		return await this.spotsService.createLocation(location);
	}

	// Test
	@Get('/location')
	async getAllLocation() {
		return await this.spotsService.getAllLocation();
	}

	// Test
	@Post('/theme')
	async createTheme(@Body() theme: ThemeRequestDto) {
		return await this.spotsService.createTheme(theme);
	}

	// Test
	@Get('/theme')
	async getAllTheme() {
		return await this.spotsService.getAllTheme();
	}

	// Test
	@Post('/snsPost')
	async createSnsPost(@Body() snsPost: SnsPostRequestDto) {
		return await this.spotsService.createSnsPost(snsPost);
	}

	// Test
	@Get('/snsPost')
	async getAllSnsPost() {
		return await this.spotsService.getAllSnsPost();
	}
}
