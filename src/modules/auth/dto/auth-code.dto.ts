import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { AuthCodeType } from 'src/types/auth-code.types';

export class AuthCodeDto {
	@IsEmail()
	@ApiProperty({ example: 'test@naver.com', description: '이메일' })
	readonly email: string;

	@IsString()
	@ApiProperty({
		example: AuthCodeType.SighUp,
		description: '인증 타입 (회원가입중: SignUp, 비밀번호변경중: FindPw)',
	})
	readonly type: AuthCodeType;

	@IsString()
	@ApiProperty({ example: 'h6f11d06', description: '이름' })
	readonly code: string;
}
