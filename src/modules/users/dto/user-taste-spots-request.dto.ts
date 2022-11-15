import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';

export class UserTasteSpotsRequestDto {
	@IsArray()
	@ArrayMinSize(5)
	@ArrayMaxSize(25)
	@Type(() => Number)
	@ApiProperty({ example: [1, 2, 3, 4, 5], description: '선택한 여행지 id 리스트' })
	readonly tasteSpots: number[];
}
