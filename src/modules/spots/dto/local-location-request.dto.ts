import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LocalLocationRequestDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '광역자치단체 id' })
	readonly metroLocationId: number;

	@IsNumber()
	@ApiProperty({ example: 2, description: '지역자치단체 없는 광역자치단체 구분하기 위한 depth 표시' })
	readonly depth: number;

	@IsString()
	@ApiProperty({ example: '수원시', description: '지역자치단체 이름' })
	readonly name: string;
}
