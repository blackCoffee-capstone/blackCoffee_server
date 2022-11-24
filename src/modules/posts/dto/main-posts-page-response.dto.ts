import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class MainPostsPageResponseDto<P> {
	@IsNumber()
	@ApiProperty({ example: 10, description: '검색 결과 총 페이지 수' })
	readonly totalPage: number;

	@IsArray()
	@ApiProperty({ isArray: true, example: '켜뮤니티 게시글 리스트' })
	readonly posts: P[];

	constructor({ totalPage, posts }) {
		this.totalPage = totalPage;
		this.posts = posts;
	}
}
