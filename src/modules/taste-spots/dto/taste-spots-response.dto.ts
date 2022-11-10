import { ApiProperty } from '@nestjs/swagger';

export class TasteSpotsResponseDto {
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@ApiProperty({ example: 'test', description: '여행지 이름' })
	readonly name: string;

	@ApiProperty({ example: '서울시', description: '여행지 위치명' })
	readonly locationName: string;

	constructor({ id, name, locationName }) {
		this.id = id;
		this.name = name;
		this.locationName = locationName;
	}
}
