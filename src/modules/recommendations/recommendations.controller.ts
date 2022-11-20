import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiDocs } from './recommendations.docs';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
@ApiTags('recommendations - 사용자 추천 여행지')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
	constructor(private readonly recommendationsService: RecommendationsService) {}

	@Get('/list')
	@ApiDocs.recommendationsSpotsList('추천 여행지 페이지 리스트 기준')
	async recommendationsSpotsList(@AuthUser() userData) {
		return await this.recommendationsService.recommendationsSpotsList(userData.id);
	}

	@Get('/map')
	@ApiDocs.recommendationsSpotsMap('추천 여행지 페이지 지도 기준')
	async recommendationsSpotsMap(@AuthUser() userData) {
		return await this.recommendationsService.recommendationsSpotsMap(userData.id);
	}
}
