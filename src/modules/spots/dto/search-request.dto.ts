import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { SortType } from 'src/types/sort.types';

export class SearchRequestDto {
	@IsString()
	@IsOptional()
	@ApiProperty({ example: '을왕리', description: '검색어' })
	readonly word?: string;

	@IsEnum(SortType)
	@IsOptional()
	@ApiProperty({
		enum: SortType,
		default: SortType.Name,
		description: '정렬 기준 (이름순: Name, 인기순: Rank)',
	})
	readonly sorter?: SortType = SortType.Name;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ default: 1, description: '페이지 번호' })
	readonly page?: number = 1;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ default: 20, description: '페이지 별 데이터 개수' })
	readonly take?: number = 20;

	@IsOptional()
	@Transform((params) => params.value.split(',').map(Number))
	@ApiProperty({ example: '1,10', description: '위치 필터링 id list' })
	readonly locationIds?: number[];

	@IsOptional()
	@Transform((params) => params.value.split(',').map(Number))
	@ApiProperty({ example: '1,2,3', description: '테마 필터링 id list' })
	readonly themeIds?: number[];
}
