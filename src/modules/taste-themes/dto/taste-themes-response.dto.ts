import { ApiProperty } from '@nestjs/swagger';

export class TasteThemesResponseDto {
	@ApiProperty({ example: 1, description: '테마 id' })
	readonly id: number;

	@ApiProperty({ example: '산', description: '테마 이름' })
	readonly name: string;

	@ApiProperty({ example: 'test.png', description: '테마 사진 url' })
	readonly photoUrl: string;

	constructor({ id, name, photoUrl }) {
		this.id = id;
		this.name = name;
		this.photoUrl = photoUrl;
	}
}
