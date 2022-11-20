import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class FiltersResponseDto<L, T> {
	@IsArray()
	@ApiProperty({ isArray: true, example: '위치 정보 필터링 리스트' })
	readonly locations: L[];

	@IsArray()
	@ApiProperty({ isArray: true, example: '테마 정보 필터링 리스트' })
	readonly themes: T[];

	constructor({ locationsDto, themesDto }) {
		this.locations = locationsDto;
		this.themes = themesDto;
	}
}
