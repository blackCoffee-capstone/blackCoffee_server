import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class LocationFiltersResponseDto<L> {
	@IsNumber()
	@ApiProperty({ example: 1, description: '위치 id 이름' })
	readonly id: number;

	@IsNumber()
	@ApiProperty({ example: 1, description: '필터링 레벨' })
	readonly level: number;

	@IsString()
	@ApiProperty({ example: '경기도', description: '광역자치단체 이름' })
	readonly metroName: string;

	@IsArray()
	@ApiProperty({ isArray: true, example: '지역자치단체 이름 리스트' })
	readonly localNames: L[];

	constructor({ id, level, metroName, localNames }) {
		this.id = id;
		this.level = level;
		this.metroName = metroName;
		this.localNames = localNames;
	}
}
