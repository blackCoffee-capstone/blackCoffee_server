import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AdFormsRequestDto } from './ad-forms-request.dto';

export class AdFormsResponseDto extends AdFormsRequestDto {
	@IsString()
	@ApiProperty({ example: 'test', description: '사업자 등록증 사진 URL' })
	readonly licenseUrl: string;

	constructor(adForm) {
		super(adForm);
		this.licenseUrl = adForm.licenseUrl;
	}
}
