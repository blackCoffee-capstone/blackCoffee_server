import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class RankingListResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@IsString()
	@ApiProperty({ example: '인천 옹진군 자월면 승봉로29번길 15', description: '주소 이름' })
	readonly address: string;

	@IsNumber()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number;

	@IsNumber()
	@ApiProperty({ example: -1, description: '순위 변동' })
	readonly variance: number;

	@IsNumber()
	@ApiProperty({ example: 10, description: '여행지 조회수' })
	readonly views: number;

	@IsNumber()
	@ApiProperty({ example: 10, description: '여행지 찜하기 개수' })
	readonly wishes: number;

	@IsString()
	@ApiProperty({ example: 'https://scontent~', description: '여행지 사진 링크' })
	readonly photoUrl: string;

	@IsBoolean()
	@ApiProperty({ example: false, description: '여행지 찜하기 여부' })
	readonly isWish: boolean;

	constructor({ id, name, address, rank, variance, views, wishes, photoUrl, isWish }) {
		this.id = id;
		this.name = name;
		this.address = address;
		this.rank = rank;
		this.variance = variance;
		this.views = views;
		this.wishes = wishes;
		this.photoUrl = photoUrl;
		this.isWish = isWish;
	}
}
