import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { MetroLocationResponseDto } from './metro-location-response.dto';

export class LocalLocationResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '지역자치단체 id' })
	readonly id: number;

	@IsNumber()
	@ApiProperty({ example: 2, description: '지역자치단체 없는 광역자치단체 구분하기 위한 depth 표시' })
	readonly depth: number;

	@IsString()
	@ApiProperty({ example: '수원시', description: '지역자치단체 이름' })
	readonly name: string;

	@ApiProperty({ description: '지역자치단체 정보' })
	readonly metroLocation: MetroLocationResponseDto;

	constructor({ id, metroLocation, depth, name }) {
		this.id = id;
		this.depth = depth;
		this.name = name;
		this.metroLocation = new MetroLocationResponseDto(metroLocation);
	}
}
