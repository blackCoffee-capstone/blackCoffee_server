import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostCommentsRequestDto {
	@IsString()
	@ApiProperty({ example: 'test', description: '내용' })
	readonly content: string;
}
