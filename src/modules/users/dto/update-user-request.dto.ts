import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestDto {
	@IsString()
	@IsOptional()
	@ApiProperty({ default: 'test', description: '새로운 이름' })
	readonly name?: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ default: 'test', description: '새로운 닉네임' })
	readonly nickname?: string;
}
