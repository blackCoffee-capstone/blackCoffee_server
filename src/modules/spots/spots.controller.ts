import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocationRequestDto } from './dto/location-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
	constructor(private readonly spotsService: SpotsService) {}

	// Test
	@Post()
	async createSpot(@Body() spot: SpotRequestDto) {
		return await this.spotsService.createSpot(spot);
	}

	@Post('/location')
	async createLocation(@Body() location: LocationRequestDto) {
		return await this.spotsService.createLocation(location);
	}

	@Get()
	async getAllSpot() {
		return await this.spotsService.getAllSpot();
	}

	@Get('/location')
	async getAllLocation() {
		return await this.spotsService.getAllLocation();
	}
}
