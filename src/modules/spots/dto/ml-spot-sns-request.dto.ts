import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { MlSnsRequestDto } from './ml-sns-request.dto';

export class MlSpotSnsRequestDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly spotId: number;

	@ApiProperty({ description: 'sns 게시글 정보' })
	readonly snsPosts: MlSnsRequestDto[];

	constructor({ spotId, snsPosts }) {
		this.spotId = spotId;
		this.snsPosts = snsPosts;
	}
}
