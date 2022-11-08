import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MetroLocationResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '광역자치단체 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '인천', description: '광역자치단체 이름' })
	readonly name: string;

	constructor({ id, name }) {
		this.id = id;
		this.name = name;
	}
}
