import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SearchResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@IsString()
	@ApiProperty({ example: '경상북도 경주시 남산동', description: '여행지 상세주소' })
	readonly address: string;

	constructor({ id, name, address }) {
		this.id = id;
		this.name = name;
		this.address = address;
	}
}
