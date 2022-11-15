import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignUpRequestDto {
	@IsEmail()
	@ApiProperty({ example: 'test@naver.com', description: '이메일' })
	readonly email: string;

	@IsString()
	@Length(8, 24)
	@ApiProperty({ example: '1234abcd!', description: '패스워드' })
	password: string;

	@IsString()
	@ApiProperty({ example: 'test', description: '이름' })
	readonly name: string;

	@IsString()
	@ApiProperty({ example: 'test', description: '닉네임' })
	readonly nickname: string;

	@IsOptional()
	@IsDateString()
	@ApiProperty({ example: '2000-01-01', description: '생년월일' })
	readonly birthdate?: Date;
}
