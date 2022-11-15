import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ThemeRequestDto {
	@IsString()
	@ApiProperty({ example: '산', description: '테마 이름' })
	readonly name: string;

	constructor({ themeName }) {
		this.name = themeName;
	}
}
