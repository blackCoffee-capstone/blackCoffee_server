import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RanksRecordRequestDto {
	@IsNumber()
	@ApiProperty({ example: 2022113, description: '요청 날짜(연도 + 월 + 주차)' })
	readonly date: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly spotId: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number;

	constructor({ date, spotId, rank }) {
		this.date = date;
		this.spotId = spotId;
		this.rank = rank;
	}
}
