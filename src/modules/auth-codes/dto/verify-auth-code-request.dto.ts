import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyAuthCodeRequestDto {
	@IsEmail()
	@ApiProperty({ example: 'test@naver.com', description: '이메일' })
	readonly email: string;

	@IsString()
	@ApiProperty({ example: 'h6f11d06', description: '인증코드' })
	readonly code: string;
}
