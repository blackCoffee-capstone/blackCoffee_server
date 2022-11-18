import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

const currentDate = new Date();

export class RankingRequestDto {
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ example: 2022, description: '연도' })
	readonly year?: number = currentDate.getFullYear();

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ example: 1, description: '월' })
	readonly month?: number = currentDate.getMonth() + 1;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ example: 1, description: '주차' })
	week?: number = this.getWeek;

	// 임시 계산
	get getWeek(): number {
		const date = new Date();
		const cudate = date.getDate();
		const start = new Date(date.setDate(1));
		const day = start.getDay();
		const week = parseInt(`${(day - 1 + cudate) / 7 + 1}`);
		return week;
	}
}
