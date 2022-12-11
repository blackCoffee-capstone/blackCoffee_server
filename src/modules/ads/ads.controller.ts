import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from './ads.docs';
import { AdsService } from './ads.service';
import { ClickAdsRequestDto } from './dto/click-ads-request.dto';
import { GetAdFilterRequestDto } from './dto/get-ad-filter-request.dto';

@Controller('ads')
@ApiTags('ads - 광고 클릭')
export class AdsController {
	constructor(private readonly adsService: AdsService) {}

	@Get('')
	@ApiDocs.getAdsFilter('게시용 광고 목록 반환')
	async getAdsFilter(@Query() getAdRequest?: GetAdFilterRequestDto) {
		return await this.adsService.getAdsFilter(getAdRequest);
	}

	@Post('/click')
	@ApiDocs.clickAds('광고 클릭하면 클릭 횟수 증가')
	async clickAds(@Body() clickAdsDto: ClickAdsRequestDto) {
		return await this.adsService.clickAds(clickAdsDto.adId);
	}
}
