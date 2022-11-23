import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostsRequestDto {
	@IsString()
	@ApiProperty({ example: 'test', description: '제목' })
	readonly title: string;

	@IsString()
	@ApiProperty({ example: 'test', description: '내용' })
	readonly content: string;

	@IsString()
	@ApiProperty({ example: '37.253452', description: '위도' })
	readonly latitude: string;

	@IsString()
	@ApiProperty({ example: '126.234523', description: '경도' })
	readonly longitude: string;
}
