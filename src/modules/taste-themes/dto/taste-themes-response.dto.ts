import { ApiProperty } from '@nestjs/swagger';
import { TasteThemesLocationResponseDto } from './taste-themes-location-response.dto';

export class TasteThemesResponseDto {
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@ApiProperty({ example: 'test', description: '여행지 이름' })
	readonly name: string;

	@ApiProperty({ description: '여행지 위치' })
	readonly location: TasteThemesLocationResponseDto;

	constructor({ id, name, location }) {
		this.id = id;
		this.name = name;
		this.location = location;
	}
}
