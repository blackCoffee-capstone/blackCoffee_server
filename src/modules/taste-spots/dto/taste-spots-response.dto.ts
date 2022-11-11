import { ApiProperty } from '@nestjs/swagger';
import { TasteSpotsLocationResponseDto } from './taste-spots-location-response.dto';

export class TasteSpotsResponseDto {
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@ApiProperty({ example: 'test', description: '여행지 이름' })
	readonly name: string;

	@ApiProperty({ description: '여행지 위치' })
	readonly location: TasteSpotsLocationResponseDto;

	constructor({ id, name, location }) {
		this.id = id;
		this.name = name;
		this.location = location;
	}
}
