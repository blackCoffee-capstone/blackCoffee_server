import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { UserLikesDto } from 'src/modules/likes/dto/user-likes.dto';

export class UserPostsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 10, description: '총 페이지 수' })
	readonly totalPage: number;

	@IsNumber()
	@ApiProperty({ example: 10, description: '총 작성한 게시글 수' })
	readonly totalPosts: number;

	@IsArray()
	@ApiProperty({ isArray: true, example: '작성한 게시글 리스트' })
	readonly posts: UserLikesDto[];

	constructor({ totalPage, totalPosts, posts }) {
		this.totalPage = totalPage;
		this.totalPosts = totalPosts;
		this.posts = posts;
	}
}
