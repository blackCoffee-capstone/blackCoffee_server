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

	@IsNumber()
	@ApiProperty({ example: 1, description: '광고 클릭 수' })
	readonly click: number;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '광고 요청 날짜' })
	readonly createdAt: Date;

	constructor({ id, businessName, email, click, createdAt }) {
		this.id = id;
		this.businessName = businessName;
		this.email = email;
		this.click = click;
		this.createdAt = createdAt;
	}
}
