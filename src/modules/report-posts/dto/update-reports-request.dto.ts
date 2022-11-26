import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AdFormType } from 'src/types/ad-form.types';

export class UpdateReportsRequestDto {
	@IsEnum(AdFormType)
	@ApiProperty({
		enum: AdFormType,
		example: AdFormType.Approve,
		description: '신고 상태 기준 (신청: Todo, 승인: Approve, 거부: Reject)',
	})
	readonly status: AdFormType;
}
