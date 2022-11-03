import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LocationResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '위치 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리', description: '위치 이름' })
	readonly name: string;

	constructor({ id, name }) {
		this.id = id;
		this.name = name;
	}
}
