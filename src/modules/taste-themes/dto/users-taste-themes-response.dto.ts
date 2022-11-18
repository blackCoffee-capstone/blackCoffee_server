import { ApiProperty } from '@nestjs/swagger';

export class UsersTasteThemesResponseDto {
	@ApiProperty({ example: 1, description: '테마 id' })
	readonly id: number;

	@ApiProperty({ example: '산', description: '테마 이름' })
	readonly name: string;

	constructor({ id, name }) {
		this.id = id;
		this.name = name;
	}
}
