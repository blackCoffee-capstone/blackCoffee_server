import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Geometry } from 'geojson';

import { AdFormsRequestDto } from './ad-forms-request.dto';

export class AdFormsResponseDto extends AdFormsRequestDto {
	@IsString()
	@ApiProperty({ example: 'test', description: '사업자 등록증 사진 URL' })
	readonly licenseUrl: string;

	@IsString()
	@ApiProperty({ example: '(37.253452, 126.234523)', description: '[위도, 경도]' })
	readonly geom: Geometry;

	constructor(adForm) {
		super(adForm);
		this.licenseUrl = adForm.licenseUrl;
		this.geom = adForm.geom;
	}
}
