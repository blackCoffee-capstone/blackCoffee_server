import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AdsRegisterRequestDto } from './ads-register-request.dto';

export class UpdateAdsRequestDto extends PickType(PartialType(AdsRegisterRequestDto), [
	'businessName',
	'email',
	'pageUrl',
]) {
	@IsString()
	@ApiProperty({ example: 'test', description: '사업지 주소' })
	readonly address?: string;
}
