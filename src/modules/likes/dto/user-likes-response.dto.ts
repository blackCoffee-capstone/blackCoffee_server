import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { UserLikesDto } from './user-likes.dto';

export class UserLikesResponseDto {
	@IsNumber()
	@ApiProperty({ example: 10, description: '총 페이지 수' })
	readonly totalPage: number;

	@IsNumber()
	@ApiProperty({ example: 10, description: '총 좋아요한 게시글 수' })
	readonly totalLikePosts: number;

	@IsArray()
	@ApiProperty({ isArray: true, example: '좋아요한 게시글 리스트' })
	readonly likePosts: UserLikesDto[];

	constructor({ totalPage, totalLikePosts, likePosts }) {
		this.totalPage = totalPage;
		this.totalLikePosts = totalLikePosts;
		this.likePosts = likePosts;
	}
}
