import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';
import { CommentsUserResponseDto } from 'src/modules/users/dto/comments-user-response.dto';

export class MainPostsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '커뮤니티 게시글 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '제목' })
	readonly title: string;

	@ApiProperty({ description: '작성자 정보' })
	readonly user: CommentsUserResponseDto;

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

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	@IsArray()
	@ApiProperty({ isArray: true, example: ['test'], description: '사진 url 리스트' })
	readonly photoUrls: string[];

	constructor({ id, title, user, createdAt, views, likes, isLike, location, photoUrls }) {
		this.id = id;
		this.title = title;
		this.user = user;
		this.createdAt = createdAt;
		this.views = views;
		this.likes = likes;
		this.isLike = isLike;
		this.location = new LocationResponseDto(location);
		this.photoUrls = photoUrls;
	}
}
