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

	@ApiProperty({ example: 'Kakao', description: '사용자 타입 (카카오유저, 관리자)' })
	readonly type: UserType;

	@ApiProperty({ example: '2000-01-01', description: '사용자 생년월일' })
	readonly birthdate: Date | null;

	constructor({ id, name, nickname, email, type, birthdate }) {
		this.id = id;
		this.name = name;
		this.nickname = nickname;
		this.email = email;
		this.type = type;
		this.birthdate = birthdate;
	}
}
