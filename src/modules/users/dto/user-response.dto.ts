import { ApiProperty } from '@nestjs/swagger';

import { UserType } from 'src/types/users.types';

export class UserResponseDto {
	@ApiProperty({ example: 1, description: '사용자 id' })
	readonly id: number;

	@ApiProperty({ example: 'test', description: '사용자 이름' })
	readonly name: string;

	@ApiProperty({ example: 'test', description: '사용자 닉네임 (초기에는 이름과 동일)' })
	readonly nickname: string;

	@ApiProperty({ example: 'test@naver.com', description: '사용자 이메일' })
	readonly email: string;

	@ApiProperty({ example: 'Kakao', description: '사용자 타입 (카카오유저, 페이스북유저, 관리자)' })
	readonly type: UserType;

	@ApiProperty({ example: true, description: '첫 로그인 유무' })
	readonly isNewUser: boolean;

	constructor({ id, name, nickname, email, type, isNewUser }) {
		this.id = id;
		this.name = name;
		this.nickname = nickname;
		this.email = email;
		this.type = type;
		this.isNewUser = isNewUser;
	}
}
