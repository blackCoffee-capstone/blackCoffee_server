import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpRequestDto {
	@IsEmail()
	@ApiProperty({ example: 'test@naver.com', description: '이메일' })
	readonly email: string;

	@IsString()
	@Length(8, 15)
	@ApiProperty({ example: '1234abcd!', description: '패스워드' })
	password: string;

	@IsString()
	@ApiProperty({ example: 'test', description: '이름' })
	readonly name: string;

	@IsString()
	@ApiProperty({ example: 'test', description: '닉네임' })
	readonly nickname: string;
}
