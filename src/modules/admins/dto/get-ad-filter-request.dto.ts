import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetAdFilterRequestDto {
	@IsOptional()
	@Transform((params) => params.value.split(',').map(Number))
	@ApiProperty({ example: '1,10', description: '위치 필터링 id list' })
	readonly locationIds?: number[];
}
