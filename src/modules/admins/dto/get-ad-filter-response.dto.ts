import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetAdFilterResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '광고 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'https://www.naver.com/', description: '사업 페이지 URL' })
	readonly pageUrl: string;

	@IsString()
	@ApiProperty({ example: 'licesce~', description: '광고 배경 사진 URL' })
	readonly photoUrl: string;

	constructor({ id, pageUrl, photoUrl }) {
		this.id = id;
		this.pageUrl = pageUrl;
		this.photoUrl = photoUrl;
	}
}
