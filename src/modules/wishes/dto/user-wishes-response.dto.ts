import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { UserWishesDto } from './user-wishes.dto';

export class UserWishesResponseDto {
	@IsNumber()
	@ApiProperty({ example: 10, description: '총 페이지 수' })
	readonly totalPage: number;

	@IsNumber()
	@ApiProperty({ example: 10, description: '총 찜한 여행지 수' })
	readonly totalWishSpots: number;

	@IsArray()
	@ApiProperty({ isArray: true, example: '찜한 여행지 리스트' })
	readonly wishSpots: UserWishesDto[];

	constructor({ totalPage, totalWishSpots, wishSpots }) {
		this.totalPage = totalPage;
		this.totalWishSpots = totalWishSpots;
		this.wishSpots = wishSpots;
	}
}
