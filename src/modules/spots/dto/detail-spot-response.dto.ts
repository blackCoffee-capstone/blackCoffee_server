import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Geometry } from 'geojson';

export class DetailSpotResponseDto<T> {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly spotName: string;

	@IsNotEmpty()
	@ApiProperty({ example: '(37.253452, 126.234523)', description: '[위도, 경도]' })
	readonly geom: Geometry;

	@IsArray()
	@ApiProperty({ isArray: true, example: '관련 sns 게시글 정보' })
	readonly detailSnsPost: T[];

	@IsNumber()
	@ApiProperty({ example: 1, description: '호감도' })
	readonly favorability: number;

	constructor({ id, spotName, geom, favorability, detailSnsPost }) {
		this.id = id;
		this.spotName = spotName;
		this.geom = geom;
		this.favorability = favorability;
		this.detailSnsPost = detailSnsPost;
	}
}
