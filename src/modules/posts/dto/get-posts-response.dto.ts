import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
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
	readonly content: string;

	@IsArray()
	@ApiProperty({ isArray: true, example: ['test'], description: '사진 url 리스트' })
	readonly photoUrls: string[];

	@IsBoolean()
	@ApiProperty({ example: true, description: '작성자 유무' })
	readonly writer: boolean;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	@IsArray()
	@Type(() => ThemeResponseDto)
	@ApiProperty({ description: '테마 정보' })
	readonly themes: ThemeResponseDto[];

	constructor({ id, title, content, photo_urls, writer, location, themes }) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.photoUrls = photo_urls;
		this.writer = writer;
		this.location = location;
		this.themes = themes;
	}
}
