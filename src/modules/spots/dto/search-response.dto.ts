import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';

export class SearchResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	constructor({ id, name, location }) {
		this.id = id;
		this.name = name;
		this.location = new LocationResponseDto(location);
	}
}
