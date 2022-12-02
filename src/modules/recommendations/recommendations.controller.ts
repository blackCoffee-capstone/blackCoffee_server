import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/types/users.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { ApiDocs } from './recommendations.docs';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
@ApiTags('recommendations - 사용자 추천 여행지')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
	constructor(private readonly recommendationsService: RecommendationsService) {}

	@Post()
	@ApiDocs.updateMlRecommendations('추천 모델 훈련')
	@UseGuards(RolesGuard)
	@Roles(UserType.Admin)
	async updateMlRecommendations() {
		return await this.recommendationsService.updateMlRecommendations();
	}

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
