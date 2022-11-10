import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SearchResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly spotName: string;

	constructor({ id, spotName }) {
		this.id = id;
		this.spotName = spotName;
	}
}