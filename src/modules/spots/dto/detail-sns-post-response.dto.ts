import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

import { ThemeResponseDto } from '../../filters/dto/theme-response.dto';

export class DetailSnsPostResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: 'sns post id' })
	readonly id: number;

	@IsDateString()
	@ApiProperty({ example: '2022-02-01', description: 'sns 게시글 등록일' })
	readonly date: Date;

	@IsNumber()
	@ApiProperty({ example: 100, description: 'sns 게시글 좋아요 수' })
	readonly likeNumber: number;

	@IsString()
	@ApiProperty({ example: 'https://www~', description: 'sns 게시글 링크' })
	readonly snsPostUrl: string;

	@IsString()
	@ApiProperty({ example: 'https://scontent~', description: 'sns 게시글 사진 링크' })
	readonly photoUrl: string;

	@IsString()
	@ApiProperty({ example: '해변가 캠핑', description: 'sns 게시글 내용' })
	readonly content: string;

	@ApiProperty({ description: '테마' })
	readonly theme: ThemeResponseDto;

	constructor({ id, date, likeNumber, photoUrl, content, theme }) {
		this.id = id;
		this.date = date;
		this.likeNumber = likeNumber;
		this.photoUrl = photoUrl;
		this.content = content;
		this.theme = new ThemeResponseDto(theme);
	}
}
