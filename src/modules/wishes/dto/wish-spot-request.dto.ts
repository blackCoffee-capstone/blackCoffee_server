import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class WishSpotRequestDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly spotId: number;

	@IsBoolean()
	@ApiProperty({ example: true, description: '찜하기 여부' })
	readonly isWish: boolean;
}
