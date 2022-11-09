import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LocationRequestDto {
	@IsString()
	@ApiProperty({ example: '수원시', description: '지역자치단체 이름' })
	readonly metroLocationName: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ example: '수원시', description: '지역자치단체 이름' })
	readonly localLocationName: string;
}
