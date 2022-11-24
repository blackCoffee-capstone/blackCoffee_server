import { ApiProperty } from '@nestjs/swagger';

export class CommentsUserResponseDto {
	@ApiProperty({ example: 1, description: '사용자 id' })
	readonly id: number;

	@ApiProperty({ example: 'test', description: '사용자 닉네임' })
	readonly nickname: string;

	constructor({ id, nickname }) {
		this.id = id;
		this.nickname = nickname;
	}
}
