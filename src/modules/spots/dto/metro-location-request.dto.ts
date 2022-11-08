import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MetroLocationRequestDto {
	@IsString()
	@ApiProperty({ example: '인천', description: '위치 이름' })
	readonly name: string;
}
