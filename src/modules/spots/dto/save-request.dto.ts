import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveRequestDto {
	@IsString()
	@ApiProperty({ example: '경기도', description: '광역자치단체 이름' })
	readonly metroName: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ example: '수원시', description: '지역자치단체 이름' })
	readonly localName: string;

	@IsString()
	@ApiProperty({ example: '을왕리해수욕장', description: '여행지 이름' })
	readonly name: string;

	@IsNumber()
	@ApiProperty({ example: 37.253452, description: '위도' })
	readonly latitude: number;

	@IsNumber()
	@ApiProperty({ example: 126.234523, description: '경도' })
	readonly longitude: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ example: 1, description: '순위' })
	readonly rank: number | null;

	@IsDateString()
	@ApiProperty({ example: '2022-02-01', description: 'sns 게시글 등록일' })
	readonly date: Date;

	@IsNumber()
	@ApiProperty({ example: 100, description: 'sns 게시글 좋아요 수' })
	readonly likeNumber: number;

	@IsString()
	@ApiProperty({ example: 100, description: 'sns 게시글 링크' })
	readonly photoUrl: string;

	@IsString()
	@ApiProperty({ example: '해변가 캠핑', description: 'sns 게시글 내용' })
	readonly content: string;

	@IsString()
	@ApiProperty({ example: '산', description: '테마 이름' })
	readonly themeName: string;
}
