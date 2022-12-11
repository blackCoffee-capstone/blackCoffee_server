import { Controller } from '@nestjs/common';
import { AdsService } from './ads.service';

@Controller('ads')
export class AdsController {
	constructor(private readonly adsService: AdsService) {}
}
