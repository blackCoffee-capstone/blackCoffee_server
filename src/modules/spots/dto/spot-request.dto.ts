import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Geometry } from 'geojson';

export class SpotRequestDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '위치 id' })
	readonly locationId: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@IsNumber()
	@ApiProperty({ example: 37.253452, description: '위도' })
	readonly latitude: number;

	@IsNumber()
	@ApiProperty({ example: 126.234523, description: '경도' })
	readonly longitude: number;

	@IsNotEmpty()
	@ApiProperty({ example: '(37.253452, 126.234523)', description: '[위도, 경도]' })
	readonly geom: Geometry;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number | null;

	@IsNumber()
	@ApiProperty({ example: 50, description: 'SNS 게시물 수' })
	readonly snsPostCount: number;

	@IsNumber()
	@ApiProperty({ example: 100, description: 'sns 게시글 좋아요 수' })
	readonly snsPostLikeNumber: number;

	constructor({ locationId, name, latitude, longitude, rank }) {
		this.locationId = locationId;
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
		this.geom = `(${latitude.toString()},${longitude.toString()})`;
		this.rank = rank;
		this.snsPostCount = 0;
		this.snsPostLikeNumber = 0;
	}
}
