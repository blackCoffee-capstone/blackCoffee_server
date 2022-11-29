import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class SpotsJsonDto {
	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly place: string;

	@IsString()
	@ApiProperty({ example: 'test~', description: 'sns 게시글 url' })
	readonly snsPostUrl: string;

	@IsString()
	@ApiProperty({ example: 'test~', description: 'sns 게시글 사진 url' })
	readonly photoUrl: string;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: 'sns 게시글 등록일' })
	readonly datetime: Date;

	@IsString()
	@ApiProperty({ example: '10', description: 'sns 게시글 좋아요수 (텍스트)' })
	readonly like: string;

	@IsString()
	@ApiProperty({ example: 'test~', description: 'sns 게시글 글' })
	readonly text: string;

	constructor({ place, snsPostUrl, photoUrl, datetime, like, text }) {
		this.place = place;
		this.snsPostUrl = snsPostUrl;
		this.photoUrl = photoUrl;
		this.datetime = datetime;
		this.like = like;
		this.text = text;
	}
}
