import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { ApiDocs } from './ad-forms.docs';
import { AdFormsService } from './ad-forms.service';
import { AdFormsRequestDto } from './dto/ad-forms-request.dto';

@Controller('ad-forms')
@ApiTags('adForms - 광고 요청')
export class AdFormsController {
	constructor(private readonly adformsService: AdFormsService) {}

	@Post()
	@ApiDocs.registerAdForm('광고 요청 등록')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: (request, file, callback) => {
				if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					callback(null, true);
				} else {
					callback(
						new HttpException(
							{
								message: 1,
								error: '지원하지 않는 이미지 형식입니다.',
							},
							HttpStatus.BAD_REQUEST,
						),
						false,
					);
				}
			},
		}),
	)
	async registerAdForm(@UploadedFile() licenseFile: Express.Multer.File, @Body() adFormData: AdFormsRequestDto) {
		return await this.adformsService.registerAdForm(licenseFile, adFormData);
	}
}
