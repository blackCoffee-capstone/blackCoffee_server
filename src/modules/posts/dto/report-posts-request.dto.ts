import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReportPostsRequestDto {
	@IsString()
	@ApiProperty({ example: 'test', description: '신고 사유' })
	readonly reason: string;
}
