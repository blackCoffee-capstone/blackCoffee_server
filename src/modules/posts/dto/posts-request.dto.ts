import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class PostsRequestDto {
	@IsString()
	@ApiProperty({ example: 'test', description: '제목' })
	readonly title: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ example: 'test', description: '내용' })
	readonly content?: string | null;

	@IsString()
	@ApiProperty({ example: '서울특별시 종로구 ~', description: '주소' })
	readonly address: string;

	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	@Transform((params) => params.value.split(',').map(Number))
	@ApiProperty({ example: '[1, 2, 3]', description: '테마 아이디 배열 (1~5개)' })
	readonly themes: number[];
}
