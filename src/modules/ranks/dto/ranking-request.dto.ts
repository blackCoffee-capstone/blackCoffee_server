import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class RankingRequestDto {
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ example: 20221103, description: '날짜(연도 + 월 + 주차)' })
	readonly date?: number = this.getDate;

	get getDate(): number {
		const currentDate = new Date();
		const date = ''.concat(
			currentDate.getFullYear().toString(),
			(currentDate.getMonth() + 1).toString().padStart(2, '0'),
			this.getWeek.toString(),
		);
		return +date;
	}

	// 임시 계산
	get getWeek(): number {
		const currentDate = new Date();
		const cudate = currentDate.getDate();
		const start = new Date(currentDate.setDate(1));
		const day = start.getDay();
		const week = parseInt(`${(day - 1 + cudate) / 7 + 1}`);
		return week;
	}
}
