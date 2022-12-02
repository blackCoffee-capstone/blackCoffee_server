import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class RankingRequestDto {
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({ example: 2022113, description: '날짜(연도 + 월 + 주차)' })
	readonly date?: number = this.getDate;

	get getDate() {
		const currentDate = new Date();
		let year = currentDate.getFullYear();
		let month = currentDate.getMonth() + 1;

		const weekNumByThur = (currentDate) => {
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth();
			const date = currentDate.getDate();

			const firstDate = new Date(year, month, 1);
			const lastDate = new Date(year, month + 1, 0);
			const firstDayOfWeek = firstDate.getDay() ? firstDate.getDay() : 7;
			const lastDayOfWeek = lastDate.getDay();
			const lastDay = lastDate.getDate();

			const firstWeekCheck = firstDayOfWeek === 5 || firstDayOfWeek === 6 || firstDayOfWeek === 7 ? true : false;
			const lastWeekCheck = lastDayOfWeek === 1 || lastDayOfWeek === 2 || lastDayOfWeek === 3 ? true : false;

			const lastWeekNo = Math.ceil((firstDayOfWeek - 1 + lastDay) / 7);

			let weekNo = Math.ceil((firstDayOfWeek - 1 + date) / 7);
			if (weekNo === 1 && firstWeekCheck) weekNo = -1;
			else if (weekNo === lastWeekNo && lastWeekCheck) weekNo = -2;
			else if (firstWeekCheck) weekNo = weekNo - 1;
			return weekNo;
		};

		let weekNo = weekNumByThur(currentDate);
		if (weekNo === -1) {
			const afterDate = new Date(year, month - 1, 0);
			year = month === 1 ? year - 1 : year;
			month = month === 1 ? 12 : month - 1;
			weekNo = weekNumByThur(afterDate);
		}
		if (weekNo === -2) {
			year = month === 12 ? year + 1 : year;
			month = month === 12 ? 1 : month + 1;
			weekNo = 1;
		}
		const date = ''.concat(year.toString(), month.toString().padStart(2, '0'), weekNo.toString());
		return +date;
	}
}
