import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocationResponseDto } from './dto/location-response.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
	constructor(private readonly spotsService: SpotsService) {}

	// Test
	@Post('/spot')
	createSpot(@Body() spot: SpotRequestDto) {
		return this.spotsService.createSpot(spot);
	}

	@Post('/location')
	createLocation(@Body() location: LocationResponseDto) {
		return this.spotsService.createLocation(location);
	}

	@Get('/all')
	getAll() {
		return this.spotsService.getAll();
	}
}
