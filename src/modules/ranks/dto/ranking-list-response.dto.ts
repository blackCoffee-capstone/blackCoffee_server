import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';

export class RankingListResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@IsNumber()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number;

	@IsNumber()
	@ApiProperty({ example: -1, description: '순위 변동' })
	readonly variance: number;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	constructor({ id, name, rank, variance, location }) {
		this.id = id;
		this.name = name;
		this.rank = rank;
		this.variance = variance;
		this.location = new LocationResponseDto(location);
	}
}
