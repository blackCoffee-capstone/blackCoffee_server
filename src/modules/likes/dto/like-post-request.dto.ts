import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class LikePostRequestDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '게시글 id' })
	readonly postId: number;

	@IsBoolean()
	@ApiProperty({ example: true, description: '좋아요 여부' })
	readonly isLike: boolean;
}
