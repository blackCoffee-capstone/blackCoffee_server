import { ApiProperty } from '@nestjs/swagger';

export class TasteSpotsLocationResponseDto {
	@ApiProperty({ example: '경기도', description: '광역자치단체 이름' })
	readonly metroName: string;

	@ApiProperty({ example: '수원시', description: '지역자치단체 이름' })
	readonly localName: string;

	constructor({ metroName, localName }) {
		this.metroName = metroName;
		this.localName = localName;
	}
}
