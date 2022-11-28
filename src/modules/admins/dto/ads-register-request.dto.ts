import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AdsRegisterRequestDto {
	@IsString()
	@ApiProperty({ example: 'test', description: '사업자명' })
	readonly businessName: string;

	@IsEmail()
	@ApiProperty({ example: 'test@gmail.com', description: '이메일' })
	readonly email: string;

	@IsString()
	@ApiProperty({ example: 'https://www.naver.com/', description: '사업 페이지 URL' })
	readonly pageUrl: string;

	@IsString()
	@ApiProperty({ example: '경기 수원시 ~', description: '사업지 주소' })
	readonly address: string;
}
