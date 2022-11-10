import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class SnsPostRequestDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '테마 id' })
	readonly themeId: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly spotId: number;

	@IsDateString()
	@ApiProperty({ example: '2022-02-01', description: 'sns 게시글 등록일' })
	readonly date: string;

	@IsNumber()
	@ApiProperty({ example: 100, description: 'sns 게시글 좋아요 수' })
	readonly likeNumber: number;

	@IsString()
	@ApiProperty({ example: 100, description: 'sns 게시글 링크' })
	readonly photoUrl: string;

	@IsString()
	@ApiProperty({ example: '해변가 캠핑', description: 'sns 게시글 내용' })
	readonly content: string;
}
