import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { UpdateReportsRequestDto } from './update-reports-request.dto';

export class AllReportsRequestDto extends PartialType(UpdateReportsRequestDto) {
	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiProperty({ example: 1, description: '커뮤니티 게시글 id' })
	readonly postId?: number;
}
