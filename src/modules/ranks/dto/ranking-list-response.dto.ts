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

	@IsNumber()
	@ApiProperty({ example: 10, description: '여행지 찜하기 개수' })
	readonly wishes: number;

	@IsString()
	@ApiProperty({ example: 'https://scontent~', description: '여행지 사진 링크' })
	readonly photoUrl: string;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	constructor({ id, name, rank, variance, views, wishes, photoUrl, location }) {
		this.id = id;
		this.name = name;
		this.rank = rank;
		this.variance = variance;
		this.views = views;
		this.wishes = wishes;
		this.photoUrl = photoUrl;
		this.location = new LocationResponseDto(location);
	}
}
