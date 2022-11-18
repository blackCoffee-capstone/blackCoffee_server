import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RanksRecordRequestDto {
	@IsNumber()
	@ApiProperty({ example: 2022, description: '연도' })
	readonly year: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '월' })
	readonly month: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '주차' })
	readonly week: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly spotId: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number;

	constructor({ year, month, week, spotId, rank }) {
		this.year = year;
		this.month = month;
		this.week = week;
		this.spotId = spotId;
		this.rank = rank;
	}
}
