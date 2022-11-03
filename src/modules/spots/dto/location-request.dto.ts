import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocationRequestDto {
	@IsString()
	@ApiProperty({ example: '을왕리', description: '위치 이름' })
	readonly name: string;
}
