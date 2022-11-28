import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { AdFormType } from 'src/types/ad-form.types';

export class AdFormsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '광고 요청 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '사업자명' })
	readonly businessName: string;

	@IsEmail()
	@ApiProperty({ example: 'test@gmail.com', description: '이메일' })
	readonly email: string;

	@IsEnum(AdFormType)
	@ApiProperty({
		enum: AdFormType,
		description: '광고 요청 상태 기준 (신청: Todo, 승인: Approve, 거부: Reject)',
	})
	readonly status: AdFormType;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '광고 요청 날짜' })
	readonly createdAt: Date;

	constructor({ id, businessName, email, status, createdAt }) {
		this.id = id;
		this.businessName = businessName;
		this.email = email;
		this.status = status;
		this.createdAt = createdAt;
	}
}
