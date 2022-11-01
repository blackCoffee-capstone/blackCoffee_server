import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ResponseSpotDto } from './dto/response-spot.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
	constructor(private readonly spotsService: SpotsService) {}

	@Post()
	create(@Body() spot: ResponseSpotDto) {
		return this.spotsService.create(spot);
	}
}
