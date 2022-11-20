import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LocationResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '위치 id 이름' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '경기도', description: '지역자치단체 이름' })
	readonly metroName: string;

	@IsString()
	@ApiProperty({ example: '수원시', description: '지역자치단체 이름' })
	readonly localName: string;

	constructor({ id, metroName, localName }) {
		this.id = id;
		this.metroName = metroName;
		this.localName = localName;
	}
}
