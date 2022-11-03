import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocationRequestDto } from './dto/location-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
	constructor(private readonly spotsService: SpotsService) {}

	// Test
	@Post()
	createSpot(@Body() spot: SpotRequestDto) {
		return this.spotsService.createSpot(spot);
	}

	@Post('/location')
	createLocation(@Body() location: LocationRequestDto) {
		return this.spotsService.createLocation(location);
	}

	@Get()
	getAllSpot() {
		return this.spotsService.getAllSpot();
	}

	@Get('/location')
	getAllLocation() {
		return this.spotsService.getAllLocation();
	}
}
