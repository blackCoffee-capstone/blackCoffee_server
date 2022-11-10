import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortType } from 'src/types/sort.types';

export class SearchRequestDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ default: '', example: '을왕리', description: '검색어' })
	readonly word?: string = '';

	@IsEnum(SortType)
	@IsOptional()
	@ApiPropertyOptional({
		enum: SortType,
		default: SortType.SpotName,
		description: '정렬 기준 (이름순: spot_name, 인기순: rank)',
	})
	readonly sorter?: SortType = SortType.SpotName;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiPropertyOptional({ default: 20, description: '페이지 번호' })
	readonly page?: number = 1;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiPropertyOptional({ default: 20, description: '페이지 별 여행지 개수' })
	readonly take?: number = 20;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiPropertyOptional({ example: 1, description: '위치 id' })
	locationId?: number;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiPropertyOptional({ example: 1, description: '테마 id' })
	themeId?: number;
}
