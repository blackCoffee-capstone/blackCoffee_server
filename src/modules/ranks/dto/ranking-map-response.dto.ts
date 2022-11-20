import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';

export class RankingMapResponseDto {
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
	@ApiProperty({ example: 37.253452, description: '위도' })
	readonly latitude: number;

	@IsNumber()
	@ApiProperty({ example: 126.234523, description: '경도' })
	readonly longitude: number;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	constructor({ id, name, rank, latitude, longitude, location }) {
		this.id = id;
		this.name = name;
		this.rank = rank;
		this.latitude = latitude;
		this.longitude = longitude;
		this.location = new LocationResponseDto(location);
	}
}
