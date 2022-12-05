import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SnsPhotoJsonDto {
	@IsString()
	@ApiProperty({ example: 'test~', description: 'sns 게시글 url' })
	readonly snsPostUrl: string;

	@IsString()
	@ApiProperty({ example: 'test~', description: 'sns 게시글 사진 url' })
	readonly photoUrl: string;

	constructor({ snsPostUrl, photoUrl }) {
		this.snsPostUrl = snsPostUrl;
		this.photoUrl = photoUrl;
	}
}
