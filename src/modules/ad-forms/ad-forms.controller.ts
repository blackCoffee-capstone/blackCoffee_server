import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdFormsService } from './ad-forms.service';

@Controller('ad-forms')
@ApiTags('adForms - 광고 요청')
export class AdFormsController {
	constructor(private readonly adformsService: AdFormsService) {}

	@Post()
	async registerAdForm(@Body() adFormData) {
		return await this.adformsService.registerAdForm(adFormData);
	}
}
