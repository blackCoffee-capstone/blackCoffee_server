import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RanksUpdateRequestDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly spotId: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number;

	constructor({ spotId, rank }) {
		this.spotId = spotId;
		this.rank = rank;
	}
}
