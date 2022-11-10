import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiDocs } from './taste-spots.docs';
import { TasteSpotsService } from './taste-spots.service';

@Controller('taste-spots')
@ApiTags('tasteSpots - 여행지 취향 정보')
@UseGuards(JwtAuthGuard)
export class TasteSpotsController {
	constructor(private readonly tasteSpotsService: TasteSpotsService) {}

	@Get()
	@ApiDocs.getTasteSpots('여행지 취향 선택 리스트 반환')
	async getTasteSpots(@Query('length') length: number) {
		return await this.tasteSpotsService.getTasteSpots(length);
	}
}
