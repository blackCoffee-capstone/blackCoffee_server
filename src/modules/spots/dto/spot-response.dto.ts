import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Geometry } from 'geojson';
import { LocalLocationResponseDto } from './local-location-response.dto';

export class SpotResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly spotName: string;

	@IsNotEmpty()
	@ApiProperty({ example: '(37.253452, 126.234523)', description: '[위도, 경도]' })
	readonly geom: Geometry;

	@IsNumber()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number;

	@IsNumber()
	@ApiProperty({ example: 50, description: 'SNS 게시물 수' })
	readonly snsPostCount: number;

	@IsNumber()
	@ApiProperty({ example: 100, description: 'sns 게시글 좋아요 수' })
	readonly snsPostLikeNumber: number;

	@ApiProperty({ description: '지역자치단체 정보' })
	readonly localLocation: LocalLocationResponseDto;

	constructor({ id, spotName, geom, rank, snsPostCount, snsPostLikeNumber, localLocation }) {
		this.id = id;
		this.spotName = spotName;
		this.geom = geom;
		this.rank = rank;
		this.snsPostCount = snsPostCount;
		this.snsPostLikeNumber = snsPostLikeNumber;
		this.localLocation = new LocalLocationResponseDto(localLocation);
	}
}
