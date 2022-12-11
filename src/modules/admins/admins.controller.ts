import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/types/users.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { ApiDocs } from './admins.docs';
import { AdminsService } from './admins.service';
import { AdFormsFilterRequestDto } from './dto/ad-forms-filter-request.dto';
import { AdFormsStatusRequestDto } from './dto/ad-forms-status-request.dto';
import { AdsRegisterRequestDto } from './dto/ads-register-request.dto';
import { UpdateAdsRequestDto } from './dto/update-ads-request.dto';

@Controller('admins')
@ApiTags('admins - 관리자 페이지')
export class AdminsController {
	constructor(private readonly adminsService: AdminsService) {}

	@Get('/ad-forms')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.getAllAdForms('광고 요청 목록 반환')
	async getAllAdForms(@Query() AdFormsFilterRequest?: AdFormsFilterRequestDto) {
		return await this.adminsService.getAllAdForms(AdFormsFilterRequest);
	}

	@Get('/ad-forms/:adFormId')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.getAdForm('광고 요청 상세 페이지')
	async getAdForm(@Param('adFormId') adFormId: number) {
		return await this.adminsService.getAdForm(adFormId);
	}

	@Patch('/ad-forms/:adFormId')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.changeAdsStatus('광고 요청 상태 변경')
	async changeAdsStatus(@Param('adFormId') adFormId: number, @Body() AdFormsStatusRequest: AdFormsStatusRequestDto) {
		return await this.adminsService.changeAdsStatus(adFormId, AdFormsStatusRequest);
	}

	@Delete('ad-forms/:adFormId')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.deleteAdForm('광고 요청 삭제')
	async deleteAdForm(@Param('adFormId') adFormId: number) {
		return await this.adminsService.deleteAdForm(adFormId);
	}

	@Get('/adsAll')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.getAllAds('광고 목록 반환')
	async getAllAds() {
		return await this.adminsService.getAllAds();
	}

	@Get('/ads/:adId')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.getAds('광고 상세 페이지')
	async getAds(@Param('adId') adId: number) {
		return await this.adminsService.getAds(adId);
	}

	@Post('/ads')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: (request, file, callback) => {
				if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
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
	@ApiDocs.registerAds('광고 등록')
	async registerAds(@UploadedFile() adFile: Express.Multer.File, @Body() AdsRegisterRequest: AdsRegisterRequestDto) {
		return this.adminsService.registerAds(adFile, AdsRegisterRequest);
	}

	@Patch('ads/:adId')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: (request, file, callback) => {
				if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
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
	@ApiDocs.updateAds('광고 수정')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	async updateAds(
		@Param('adId') adId: number,
		@UploadedFile() adFile?: Express.Multer.File,
		@Body() updateAdsRequest?: UpdateAdsRequestDto,
	) {
		return await this.adminsService.updateAds(adId, adFile, updateAdsRequest);
	}

	@Delete('ads/:adId')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.deleteAds('광고 삭제')
	async deleteAds(@Param('adId') adId: number) {
		return await this.adminsService.deleteAds(adId);
	}
}
