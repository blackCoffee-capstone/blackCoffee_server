import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNumber, IsString } from 'class-validator';
import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';

export class GetAdResponseDto {
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

	@IsString()
	@ApiProperty({ example: '경기 수원시 ~', description: '주소' })
	readonly address: string;

	@IsString()
	@ApiProperty({ example: 'https://www.naver.com/', description: '사업 페이지 URL' })
	readonly pageUrl: string;

	@IsString()
	@ApiProperty({ example: 'licesce~', description: '광고 배경 사진 URL' })
	readonly photoUrl: string;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	@IsDateString()
	@ApiProperty({ example: '2022-11-11', description: '광고 등록 날짜' })
	readonly createdAt: Date;

	constructor({ id, businessName, email, click, pageUrl, photoUrl, address, location, createdAt }) {
		this.id = id;
		this.businessName = businessName;
		this.email = email;
		this.click = click;
		this.pageUrl = pageUrl;
		this.photoUrl = photoUrl;
		this.address = address;
		this.location = location;
		this.createdAt = createdAt;
	}
}
