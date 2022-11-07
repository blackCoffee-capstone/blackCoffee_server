import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class DetailSnsPostResponseDto {
	@IsDateString()
	@ApiProperty({ example: '2022-02-01', description: 'sns 게시글 등록일' })
	readonly date: Date;

	@IsNumber()
	@ApiProperty({ example: 100, description: 'sns 게시글 좋아요 수' })
	readonly likeNumber: number;

	@IsString()
	@ApiProperty({ example: 100, description: 'sns 게시글 사진 링크' })
	readonly photoUrl: string;

	@IsString()
	@ApiProperty({ example: '해변가 캠핑', description: 'sns 게시글 내용' })
	readonly content: string;

	@ApiProperty({ example: '캠핑', description: '테마' })
	readonly theme: string;

	constructor({ date, likeNumber, photoUrl, content, theme }) {
		this.date = date;
		this.likeNumber = likeNumber;
		this.photoUrl = photoUrl;
		this.content = content;
		this.theme = theme;
	}
}
