import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';
import { ThemeResponseDto } from 'src/modules/filters/dto/theme-response.dto';

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

	@IsArray()
	@ApiProperty({ isArray: true, example: ['test'], description: '사진 url 리스트' })
	readonly photoUrls: string[];

	@IsBoolean()
	@ApiProperty({ example: true, description: '작성자 유무' })
	readonly isWriter: boolean;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '작성 날짜' })
	readonly createdAt: Date;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	@IsArray()
	@Type(() => ThemeResponseDto)
	@ApiProperty({ description: '테마 정보' })
	readonly themes: ThemeResponseDto[];

	constructor({ id, title, content, photo_urls, isWriter, created_at, location, themes }) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.photoUrls = photo_urls;
		this.isWriter = isWriter;
		this.createdAt = created_at;
		this.location = location;
		this.themes = themes;
	}
}
