import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class SearchPageResponseDto<S> {
	@IsNumber()
	@ApiProperty({ example: 10, description: '검색 결과 총 페이지 수' })
	readonly totalPage: number;

	@IsArray()
	@ApiProperty({ isArray: true, example: '검색 여행지 리스트' })
	readonly spots: S[];

	constructor({ totalPage, spots }) {
		this.totalPage = totalPage;
		this.spots = spots;
	}
}
