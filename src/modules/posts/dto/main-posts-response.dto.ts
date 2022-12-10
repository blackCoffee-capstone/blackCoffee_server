import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { CommentsUserResponseDto } from 'src/modules/users/dto/comments-user-response.dto';

export class MainPostsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '커뮤니티 게시글 id' })
	readonly id: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '커뮤니티 게시글 순서' })
	readonly order: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '제목' })
	readonly title: string;

	@ApiProperty({ description: '작성자 정보' })
	readonly user: CommentsUserResponseDto;

	@IsString()
	@ApiProperty({ example: '서울시 중구 ~', description: '주소' })
	readonly address: string;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '게시글 작성 날짜' })
	readonly createdAt: Date;

	@IsNumber()
	@ApiProperty({ example: 10, description: '게시글 조회수' })
	readonly views: number;

	@IsNumber()
	@ApiProperty({ example: 10, description: '게시글 좋아요 개수' })
	readonly likes: number;

	@IsBoolean()
	@ApiProperty({ example: false, description: '게시글 좋아요 여부' })
	readonly isLike: boolean;

	@IsArray()
	@ApiProperty({ isArray: true, example: ['test'], description: '사진 url 리스트' })
	readonly photoUrls: string[];

	constructor({ id, order, title, user, address, createdAt, views, likes, isLike, photoUrls }) {
		this.id = id;
		this.order = order;
		this.title = title;
		this.user = user;
		this.address = address;
		this.createdAt = createdAt;
		this.views = views;
		this.likes = likes;
		this.isLike = isLike;
		this.photoUrls = photoUrls;
	}
}
