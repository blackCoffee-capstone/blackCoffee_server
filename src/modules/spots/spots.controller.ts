import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { SearchRequestDto } from './dto/search-request.dto';
import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';
import { SearchFilterRequestDto } from './dto/search-filter-request.dto';

import { ApiDocs } from './spots.docs';
import { SpotsService } from './spots.service';

@Controller('spots')
@ApiTags('spots - 여행지/위치/테마/SNS Post 정보')
export class SpotsController {
	constructor(private readonly spotsService: SpotsService) {}

	@Post()
	@ApiDocs.createSpots('csv 파일 속 데이터를 DB에 저장')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: (request, file, callback) => {
					const uploadPath = 'src/database/datas';
					if (!existsSync(uploadPath)) {
						mkdirSync(uploadPath);
					}
					callback(null, uploadPath);
				},
				filename: (request, file, callback) => {
					const fileOriginName = file.originalname.split(' ').join('');
					const randomName = `${Date.now()}${fileOriginName}`;
					randomName.split(' ').join('');
					callback(null, randomName);
				},
			}),
			fileFilter: (request, file, callback) => {
				if (file.mimetype.match(/\/(csv)$/)) {
					callback(null, true);
				} else {
					callback(
						new HttpException(
							{
								message: 1,
								error: '지원하지 않는 이미지 형식입니다.',
							},
							HttpStatus.BAD_REQUEST,
						),
						false,
					);
				}
			},
		}),
	)
	async createSpots(@UploadedFile() snsPostsCsvFile: Express.Multer.File) {
		return await this.spotsService.createSpots(snsPostsCsvFile);
	}

	@Get()
	@ApiDocs.searchSpot('여행지 검색(단어 검색, 정렬, 필터링, 페이지네이션)')
	async searchSpot(@Query() searchRequest: SearchRequestDto, @Body() searchFilter: SearchFilterRequestDto) {
		return await this.spotsService.getSearchSpot(searchRequest, searchFilter);
	}

	@Get(':spotId')
	@ApiDocs.detailSpot('여행지 상세 페이지(여행지 기본 정보, 연관 sns posts')
	async detailSpot(@Query() datailRequest: DetailSpotRequestDto, @Param('spotId') spotId: number) {
		return await this.spotsService.getDetailSpot(datailRequest, spotId);
	}
}
