import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Geometry } from 'geojson';

export class DetailSpotResponseDto<T> {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@IsNotEmpty()
	@ApiProperty({ example: '(37.253452, 126.234523)', description: '[위도, 경도]' })
	readonly geom: Geometry;

	@IsNumber()
	@ApiProperty({ example: 1, description: '호감도' })
	readonly snsPostLikeNumber: number;

	@IsArray()
	@ApiProperty({ isArray: true, example: '관련 sns 게시글 정보' })
	readonly detailSnsPost: T[];

	constructor({ id, name, geom, snsPostLikeNumber, detailSnsPost }) {
		this.id = id;
		this.name = name;
		this.geom = geom;
		this.snsPostLikeNumber = snsPostLikeNumber;
		this.detailSnsPost = detailSnsPost;
	}
}
