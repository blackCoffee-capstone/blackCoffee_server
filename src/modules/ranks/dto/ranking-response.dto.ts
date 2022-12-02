import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class RankingResponseDto<R> {
	@IsNumber()
	@ApiProperty({ example: 2022113, description: '지난 주 주차(연도 + 월 + 주차)' })
	readonly prev: number | null;

	@IsNumber()
	@ApiProperty({ example: 2022113, description: '다음 주 주차(연도 + 월 + 주차)' })
	readonly next: number | null;

	@IsArray()
	@ApiProperty({ isArray: true, example: '검색 여행지 리스트' })
	readonly ranking: R[];

	constructor({ prev, next, ranking }) {
		this.prev = prev;
		this.next = next;
		this.ranking = ranking;
	}
}
