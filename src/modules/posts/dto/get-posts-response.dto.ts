import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsLatitude, IsLongitude, IsNumber, IsString } from 'class-validator';
import { LocationResponseDto } from 'src/modules/filters/dto/location-response.dto';

export class GetPostsResponseDto {
	@IsNumber()
	@ApiProperty({ example: 1, description: '커뮤니티 게시글 id' })
	readonly id: number;

	@IsString()
	@ApiProperty({ example: 'test', description: '제목' })
	readonly title: string;

	@IsString()
	@ApiProperty({ example: 'test', description: '내용' })
	readonly content: string;

	@IsLatitude()
	@ApiProperty({ example: 37.253452, description: '위도' })
	readonly latitude: number;

	@IsLongitude()
	@ApiProperty({ example: 126.234523, description: '경도' })
	readonly longitude: number;

	@IsArray()
	@ApiProperty({ isArray: true, example: ['test'], description: '사진 url 리스트' })
	readonly photoUrls: string[];

	@ApiProperty({ description: '위치 정보' })
	readonly location: LocationResponseDto;

	constructor({ id, title, content, latitude, longitude, photo_urls, location }) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.latitude = latitude;
		this.longitude = longitude;
		this.photoUrls = photo_urls;
		this.location = location;
	}
}
