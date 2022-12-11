import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ClickAdsRequestDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '광고 id' })
	readonly adId: number;
}
