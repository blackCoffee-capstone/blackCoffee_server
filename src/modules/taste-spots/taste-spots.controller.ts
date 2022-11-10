import { Controller, Get, Query } from '@nestjs/common';
import { TasteSpotsService } from './taste-spots.service';

@Controller('taste-spots')
export class TasteSpotsController {
	constructor(private readonly tasteSpotsService: TasteSpotsService) {}

	@Get()
	async getTasteSpots(@Query('length') length: number) {
		return await this.tasteSpotsService.getTasteSpots(length);
	}
}
