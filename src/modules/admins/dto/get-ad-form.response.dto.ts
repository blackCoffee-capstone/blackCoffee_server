import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';
import { AdFormType } from 'src/types/ad-form.types';

export class GetAdFormResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '광고 요청 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '사업자명' })
	readonly businessName: string;

	@IsString()
	@ApiProperty({ example: 'test', description: '사업지 주소' })
	readonly address: string;

	@IsEmail()
	@ApiProperty({ example: 'test@gmail.com', description: '이메일' })
	readonly email: string;

	@IsString()
	@ApiProperty({ example: '010-1234-1234', description: '휴대전화 번호' })
	readonly phoneNumber: string;

	@IsString()
	@ApiProperty({ example: 'licesce~', description: '사업자 등록증 사진 URL' })
	readonly licenseUrl: string;

	@IsString()
	@ApiProperty({ example: '~해주세요', description: '요구사항' })
	readonly requirement: string;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	@IsEnum(AdFormType)
	@ApiProperty({
		enum: AdFormType,
		description: '광고 요청 상태 기준 (신청: Todo, 승인: Approve, 거부: Reject)',
	})
	readonly status: AdFormType;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '광고 요청 날짜' })
	readonly createdAt: Date;

	constructor({
		id,
		businessName,
		address,
		email,
		phoneNumber,
		licenseUrl,
		requirement,
		location,
		status,
		createdAt,
	}) {
		this.id = id;
		this.businessName = businessName;
		this.address = address;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.licenseUrl = licenseUrl;
		this.requirement = requirement;
		this.location = location;
		this.status = status;
		this.createdAt = createdAt;
	}
}
