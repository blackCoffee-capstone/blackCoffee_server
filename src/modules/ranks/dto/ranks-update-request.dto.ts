import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RanksUpdateRequestDto {
	@IsNumber()
	@ApiProperty({ example: 2022122, description: '날짜(연도 + 월 + 주차)' })
	readonly week: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly spotId: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number;

	constructor({ week, spotId, rank }) {
		this.week = week;
		this.spotId = spotId;
		this.rank = rank;
	}
}
