import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

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

	@IsNumber()
	@Type(() => Number)
	@ApiProperty({ example: 1, description: '위치 id' })
	readonly locationId: number;
}
