import { Controller, Get, Query } from '@nestjs/common';

import { RankingRequestDto } from './dto/ranking-request.dto';
import { RanksService } from './ranks.service';

@Controller('ranks')
export class RanksController {
	constructor(private readonly ranksService: RanksService) {}

	@Get('/list')
	async ranksList(@Query() rankingRequest: RankingRequestDto) {
		return await this.ranksService.getRanksList(rankingRequest);
	}

	@Get('/map')
	async ranksMap(@Query() rankingRequest: RankingRequestDto) {
		return await this.ranksService.getRanksMap(rankingRequest);
	}
}
