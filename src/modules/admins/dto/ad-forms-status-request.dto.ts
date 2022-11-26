import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AdFormType } from 'src/types/ad-form.types';

export class AdFormsStatusRequestDto {
	@IsEnum(AdFormType)
	@ApiProperty({
		enum: AdFormType,
		description: '광고 요청 상태 기준 (신청: Todo, 승인: Approve, 거부: Reject)',
	})
	readonly status: AdFormType;
}
