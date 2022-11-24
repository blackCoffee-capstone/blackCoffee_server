import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';

export class DetailSpotResponseDto<S, N> {
	@IsNumber()
	@ApiProperty({ example: 1, description: '여행지 id' })
	readonly id: number;

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
	@ApiProperty({ example: 1, description: '호감도' })
	readonly snsPostLikeNumber: number;

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	@IsArray()
	@ApiProperty({ isArray: true, example: '관련 sns 게시글 정보' })
	readonly detailSnsPost: S[];

	@IsArray()
	@ApiProperty({ isArray: true, example: '여행지 주변 시설' })
	readonly neaybyFacility: N[];

	constructor({ id, name, latitude, longitude, snsPostLikeNumber, location, detailSnsPost, neaybyFacility }) {
		this.id = id;
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
		this.snsPostLikeNumber = snsPostLikeNumber;
		this.location = new LocationResponseDto(location);
		this.detailSnsPost = detailSnsPost;
		this.neaybyFacility = neaybyFacility;
	}
}
