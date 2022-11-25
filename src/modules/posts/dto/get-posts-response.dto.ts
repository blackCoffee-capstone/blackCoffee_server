import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';
import { ThemeResponseDto } from 'src/modules/filters/dto/theme-response.dto';
import { CommentsUserResponseDto } from 'src/modules/users/dto/comments-user-response.dto';

export class GetPostsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '커뮤니티 게시글 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '제목' })
	readonly title: string;

	@IsString()
	@ApiProperty({ example: 'test', description: '내용' })
	readonly content?: string | null;

	@IsString()
	@ApiProperty({ example: '서울시 중구 ~', description: '주소' })
	readonly address: string;

	@IsArray()
	@ApiProperty({ isArray: true, example: ['test'], description: '사진 url 리스트' })
	readonly photoUrls: string[];

	@IsBoolean()
	@ApiProperty({ example: true, description: '작성자 유무' })
	readonly isWriter: boolean;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '작성 날짜' })
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

	@ApiProperty({ description: '작성자 정보' })
	readonly user: CommentsUserResponseDto;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	@IsArray()
	@Type(() => ThemeResponseDto)
	@ApiProperty({ description: '테마 정보' })
	readonly themes: ThemeResponseDto[];

	constructor({
		id,
		title,
		content,
		address,
		photoUrls,
		isWriter,
		createdAt,
		views,
		likes,
		isLike,
		user,
		location,
		themes,
	}) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.address = address;
		this.photoUrls = photoUrls;
		this.isWriter = isWriter;
		this.createdAt = createdAt;
		this.views = views;
		this.likes = likes;
		this.isLike = isLike;
		this.user = user;
		this.location = location;
		this.themes = themes;
	}
}
