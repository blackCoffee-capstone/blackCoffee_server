import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginRequestDto {
	@IsEmail()
	@ApiProperty({ example: 'test@naver.com', description: '이메일' })
	readonly email: string;

	@IsString()
	@Length(8, 24)
	@ApiProperty({ example: '1234abcd!', description: '패스워드' })
	password: string;
}
