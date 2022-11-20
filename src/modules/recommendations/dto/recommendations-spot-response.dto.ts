import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class RecommendationsSpotResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@IsNumber()
	@ApiProperty({ example: 37.253452, description: '위도' })
	readonly latitude: number;

	@IsNumber()
	@ApiProperty({ example: 126.234523, description: '경도' })
	readonly longitude: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '이번주 순위' })
	readonly rank: number | null;

	@IsNumber()
	@ApiProperty({ example: 100, description: 'sns 게시글 개수' })
	readonly snsPostCount: number;

	@IsNumber()
	@ApiProperty({ example: 100, description: 'sns 게시글 좋아요 총합' })
	readonly snsPostLikeNumber: number;

	@IsString()
	@ApiProperty({ example: '경기도', description: '위치명1' })
	readonly metroName: string;

	@IsString()
	@ApiProperty({ example: '고양시', description: '위치명2' })
	readonly localName: string | null;

	@IsArray()
	@ApiProperty({ isArray: true, example: '테마명 배열' })
	readonly themes: string[];

	constructor({
		id,
		name,
		latitude,
		longitude,
		rank,
		sns_post_count,
		sns_post_like_number,
		metro_name,
		local_name,
		themes,
	}) {
		this.id = id;
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
		this.rank = rank;
		this.snsPostCount = sns_post_count;
		this.snsPostLikeNumber = sns_post_like_number;
		this.metroName = metro_name;
		this.localName = local_name;
		this.themes = themes;
	}
}
