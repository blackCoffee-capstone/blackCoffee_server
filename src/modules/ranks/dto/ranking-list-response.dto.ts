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

	@IsNumber()
	@ApiProperty({ example: 10, description: '여행지 조회수' })
	readonly views: number;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	constructor({ id, name, rank, variance, views, location }) {
		this.id = id;
		this.name = name;
		this.rank = rank;
		this.variance = variance;
		this.views = views;
		this.location = new LocationResponseDto(location);
	}
}
