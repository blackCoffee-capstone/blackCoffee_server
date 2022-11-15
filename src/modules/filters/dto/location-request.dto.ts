import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocationRequestDto {
	@IsString()
	@ApiProperty({ example: '경기도', description: '광역자치단체 이름' })
	readonly metroName: string;

	@IsString()
	@ApiProperty({ example: '수원시', description: '지역자치단체 이름' })
	localName: string | null;

	constructor({ metroName, localName }) {
		this.metroName = metroName;
		this.localName = localName;
	}
}
