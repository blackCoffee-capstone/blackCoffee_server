import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePwRequestDto {
	@IsString()
	@Length(8, 24)
	@ApiProperty({ example: '1234abcd!', description: '기존 패스워드' })
	readonly originPw: string;

	@IsString()
	@Length(8, 24)
	@ApiProperty({ example: '1234abcd!!', description: '새로운 패스워드' })
	readonly newPw: string;
}
