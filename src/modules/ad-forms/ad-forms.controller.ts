import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from './ad-forms.docs';
import { AdFormsService } from './ad-forms.service';

@Controller('ad-forms')
@ApiTags('adForms - 광고 요청')
export class AdFormsController {
	constructor(private readonly adformsService: AdFormsService) {}

	@Post()
	@ApiDocs.registerAdForm('광고 요청 등록')
	async registerAdForm(@Body() adFormData) {
		return await this.adformsService.registerAdForm(adFormData);
	}
}
