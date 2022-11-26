import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UserMyPageRequestDto {
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ default: 1, description: '페이지 번호' })
	readonly page?: number = 1;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ default: 10, description: '페이지 별 데이터 개수' })
	readonly take?: number = 10;
}
