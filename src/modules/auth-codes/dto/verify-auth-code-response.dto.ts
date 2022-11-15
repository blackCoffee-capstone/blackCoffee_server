import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyAuthCodeResponseDto {
	@IsEmail()
	@ApiProperty({ example: 'test@naver.com', description: '이메일' })
	readonly email: string;

	constructor({ email }) {
		this.email = email;
	}
}
