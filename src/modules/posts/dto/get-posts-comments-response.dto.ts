import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { CommentsUserResponseDto } from 'src/modules/users/dto/comments-user-response.dto';

export class GetPostsCommentsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '댓글 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '댓글 내용' })
	readonly content: string;

	@IsBoolean()
	@ApiProperty({ example: true, description: '댓글 작성자 유무' })
	readonly isWriter: boolean;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '댓글 작성 날짜' })
	readonly createdAt: Date;

	@ApiProperty({ description: '작성자 정보' })
	readonly user: CommentsUserResponseDto;

	constructor({ id, content, is_writer, created_at, user }) {
		this.id = id;
		this.content = content;
		this.isWriter = is_writer;
		this.createdAt = created_at;
		this.user = user;
	}
}
