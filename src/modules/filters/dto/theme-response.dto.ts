import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ThemeResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '테마 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '산', description: '테마 이름' })
	readonly name: string;

	constructor({ id, name }) {
		this.id = id;
		this.name = name;
	}
}
