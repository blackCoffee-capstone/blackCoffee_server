import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { SpotResponseDto } from './spot-response.dto';
import { ThemeResponseDto } from './theme-response.dto';

export class SnsPostResponseDto {
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
	@ApiProperty({ example: 100, description: 'sns 게시글 사진 링크' })
	readonly photoUrl: string;

	@IsString()
	@ApiProperty({ example: '해변가 캠핑', description: 'sns 게시글 내용' })
	readonly content: string;

	@ApiProperty({ example: 'sns 게시글 테마 정보' })
	readonly theme: ThemeResponseDto;

	@ApiProperty({ description: 'sns 게시글 여행지 정보' })
	readonly spot: SpotResponseDto;

	constructor({ id, date, likeNumber, photoUrl, content, theme, spot }) {
		this.id = id;
		this.date = date;
		this.likeNumber = likeNumber;
		this.photoUrl = photoUrl;
		this.content = content;
		this.theme = new ThemeResponseDto(theme);
		this.spot = new SpotResponseDto(spot);
	}
}
