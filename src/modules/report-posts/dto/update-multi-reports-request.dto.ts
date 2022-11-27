import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum } from 'class-validator';
import { AdFormType } from 'src/types/ad-form.types';

export class UpdateMultiReportsRequestDto {
	@IsArray()
	@ArrayMinSize(1)
	@Type(() => Number)
	@ApiProperty({ example: [1, 2], description: '신고 id 배열' })
	readonly reportIds: number[];

	@IsEnum(AdFormType)
	@ApiProperty({
		enum: AdFormType,
		example: AdFormType.Approve,
		description: '신고 상태 기준 (신청: Todo, 승인: Approve, 거부: Reject)',
	})
	readonly status: AdFormType;
}
