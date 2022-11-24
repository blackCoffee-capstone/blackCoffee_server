import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PostsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '커뮤니티 게시글 id' })
	readonly id: number;

	constructor({ id }) {
		this.id = id;
	}
}
