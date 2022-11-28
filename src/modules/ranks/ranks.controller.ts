import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RankingRequestDto } from './dto/ranking-request.dto';
import { ApiDocs } from './ranks.docs';
import { RanksService } from './ranks.service';

@Controller('ranks')
@ApiTags('ranks - 최신 트렌드 여행지')
export class RanksController {
	constructor(private readonly ranksService: RanksService) {}

	@Get('/list')
	@ApiDocs.ranksList('최신 트렌드 랭킹 페이지 리스트 기준')
	async ranksList(@Query() rankingRequest: RankingRequestDto) {
		return await this.ranksService.getRanksList(rankingRequest);
	}

	@Get('/map')
	@ApiDocs.ranksMap('최신 트렌드 랭킹 페이지 지도 기준')
	async ranksMap(@Query() rankingRequest: RankingRequestDto) {
		return await this.ranksService.getRanksMap(rankingRequest);
	}
}
