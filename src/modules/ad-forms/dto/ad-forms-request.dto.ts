import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AdFormsRequestDto {
	@IsString()
	@ApiProperty({ example: 'test', description: '사업자명' })
	readonly businessName: string;

	@IsString()
	@ApiProperty({ example: '서울시 중구 ~', description: '주소' })
	readonly address: string;

	@IsEmail()
	@ApiProperty({ example: 'test@gmail.com', description: '이메일' })
	readonly email: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ example: '010-1234-1234', description: '휴대전화 번호' })
	readonly phoneNumber?: string;

	@IsString()
	@ApiProperty({ example: '~해주세요', description: '요구사항' })
	readonly requirement: string;

	constructor(adForm) {
		this.businessName = adForm.businessName;
		this.address = adForm.address;
		this.email = adForm.email;
		this.phoneNumber = adForm.phoneNumber;
		this.requirement = adForm.requirement;
	}
}
