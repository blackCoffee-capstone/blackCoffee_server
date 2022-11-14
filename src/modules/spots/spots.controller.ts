import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { ApiDocs } from './spots.docs';
import { SpotsService } from './spots.service';

@Controller('spots')
@ApiTags('spots - 여행지/위치/테마/SNS Post 정보')
export class SpotsController {
	constructor(private readonly spotsService: SpotsService) {}

	@Post()
	@ApiDocs.saveSpot('Spot/Sns Post/Rank 저장 및 업데이트')
	async saveSpot() {
		return await this.spotsService.saveSpot();
	}

	@Get()
	@ApiDocs.searchSpot('여행지 검색(단어 검색, 정렬, 필터링, 페이지네이션)')
	async searchSpot(@Query() searchRequest: SearchRequestDto) {
		return await this.spotsService.getSearchSpot(searchRequest);
	}

	@Get(':spotId')
	@ApiDocs.detailSpot('여행지 상세 페이지(여행지 기본 정보, 연관 sns posts')
	async detailSpot(@Query() datailRequest: DetailSpotRequestDto, @Param('spotId') spotId: number) {
		return await this.spotsService.getDetailSpot(datailRequest, spotId);
	}
}
