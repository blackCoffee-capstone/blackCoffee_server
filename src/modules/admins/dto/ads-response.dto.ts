import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNumber, IsString } from 'class-validator';

export class AdsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '광고 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '사업자명' })
	readonly businessName: string;

	@IsEmail()
	@ApiProperty({ example: 'test@gmail.com', description: '이메일' })
	readonly email: string;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '광고 요청 날짜' })
	readonly createdAt: Date;

	constructor({ id, businessName, email, createdAt }) {
		this.id = id;
		this.businessName = businessName;
		this.email = email;
		this.createdAt = createdAt;
	}
}
