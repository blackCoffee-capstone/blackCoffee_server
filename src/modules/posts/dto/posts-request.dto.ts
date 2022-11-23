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
	@ApiProperty({ example: '서울특별시 ~~', description: '주소' })
	readonly location: string;
}
