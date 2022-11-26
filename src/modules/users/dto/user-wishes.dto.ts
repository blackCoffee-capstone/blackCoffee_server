import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UserWishesDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@IsString()
	@ApiProperty({ example: '경상북도 경주시 남산동', description: '여행지 상세주소' })
	readonly address: string;

	@IsNumber()
	@ApiProperty({ example: 10, description: '여행지 조회수' })
	readonly views: number;

	@IsNumber()
	@ApiProperty({ example: 10, description: '여행지 찜하기 개수' })
	readonly wishes: number;

	@IsBoolean()
	@ApiProperty({ example: false, description: '여행지 찜하기 여부' })
	readonly isWish: boolean;

	constructor({ id, name, address, views, wishes, isWish }) {
		this.id = id;
		this.name = name;
		this.address = address;
		this.views = views;
		this.wishes = wishes;
		this.isWish = isWish;
	}
}
