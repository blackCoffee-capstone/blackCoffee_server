import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchResponseDto {
	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly spotName: string;

	constructor({ spotName }) {
		this.spotName = spotName;
	}
}
