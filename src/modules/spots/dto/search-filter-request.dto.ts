import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class SearchFilterRequestDto {
	@IsOptional()
	@IsNumber({}, { each: true })
	@ApiProperty({ type: [Number] })
	locationIds?: number[];

	@IsOptional()
	@IsNumber({}, { each: true })
	@ApiProperty({ type: [Number] })
	themeIds?: number[];
}
