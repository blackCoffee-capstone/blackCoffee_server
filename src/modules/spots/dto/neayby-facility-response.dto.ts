import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class NeayByFacilityResponseDto {
	@IsString()
	@ApiProperty({ example: '식당', description: '여행지 주변 시설 이름' })
	readonly name: string;

	@IsString()
	@ApiProperty({ example: 'http://place.map.kakao.com/23994694', description: '주변 시설 주소' })
	readonly placeUrl: string;

	@IsString()
	@ApiProperty({ example: '인천 옹진군 자월면 승봉로29번길 15', description: '주소 이름' })
	readonly address: string;

	@IsString()
	@ApiProperty({ example: 3416, description: '여행지로부터 떨어진 거리' })
	readonly distance: number;

	@IsNumber()
	@ApiProperty({ example: '음식점', description: '주변 시설 카테고리' })
	readonly category: string;

	constructor({ name, placeUrl, address, distance, category }) {
		this.name = name;
		this.placeUrl = placeUrl;
		this.address = address;
		this.distance = distance;
		this.category = category;
	}
}
