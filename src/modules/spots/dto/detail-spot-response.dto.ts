import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class DetailSpotResponseDto<T> {
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
	@ApiProperty({ example: 1, description: '호감도' })
	readonly snsPostLikeNumber: number;

	@IsArray()
	@ApiProperty({ isArray: true, example: '관련 sns 게시글 정보' })
	readonly detailSnsPost: T[];

	constructor({ id, name, latitude, longitude, snsPostLikeNumber, detailSnsPost }) {
		this.id = id;
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
		this.snsPostLikeNumber = snsPostLikeNumber;
		this.detailSnsPost = detailSnsPost;
	}
}
