import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PostsResponseDto } from 'src/modules/posts/dto/posts-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { AdFormType } from 'src/types/ad-form.types';

export class ReportsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '신고 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '신고 사유' })
	readonly reason: string;

	@IsEnum(AdFormType)
	@ApiProperty({
		enum: AdFormType,
		example: AdFormType.Approve,
		description: '신고 상태 기준 (신청: Todo, 승인: Approve, 거부: Reject)',
	})
	readonly status: AdFormType;

	@ApiProperty({ description: '신고한 사용자' })
	readonly user: UserResponseDto;

	@ApiProperty({ description: '신고한 게시글 id (바로가기 -> GET posts/:id 요청)' })
	readonly post: PostsResponseDto;

	constructor({ id, reason, status, user, post }) {
		this.id = id;
		this.reason = reason;
		this.status = status;
		this.user = user;
		this.post = post;
	}
}
