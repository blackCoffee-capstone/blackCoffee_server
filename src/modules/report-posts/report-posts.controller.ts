import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/types/users.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { AllReportsRequestDto } from './dto/all-reports-request.dto';
import { UpdateMultiReportsRequestDto } from './dto/update-multi-reports-request.dto';
import { UpdateReportsRequestDto } from './dto/update-reports-request.dto';
import { ApiDocs } from './report-posts.docs';
import { ReportPostsService } from './report-posts.service';

@Controller('report-posts')
@ApiTags('report-posts - 신고글 정보')
@UseGuards(JwtAuthGuard)
export class ReportPostsController {
	constructor(private readonly reportPostsService: ReportPostsService) {}

	@Get()
	@UseGuards(RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.getAllReports('신고 목록 반환')
	async getAllReports(@Query() filter?: AllReportsRequestDto) {
		return await this.reportPostsService.getAllReports(filter);
	}

	@Patch()
	@UseGuards(RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.updateMultiReportsStatus('여러 신고 상태 수정하기')
	async updateMultiReportsStatus(@Body() reportIdsData: UpdateMultiReportsRequestDto) {
		return await this.reportPostsService.updateMultiReportsStatus(reportIdsData);
	}

	@Patch(':reportId')
	@UseGuards(RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.updateReportsStatus('신고 상태 수정하기')
	async updateReportsStatus(@Param('reportId') reportId: number, @Body() updateReportData: UpdateReportsRequestDto) {
		return await this.reportPostsService.updateReportsStatus(reportId, updateReportData);
	}

	@HttpCode(204)
	@Delete(':reportId')
	@UseGuards(RolesGuard)
	@Roles(UserType.Admin)
	@ApiDocs.deleteReports('신고 삭제하기')
	async deleteReports(@Param('reportId') reportId: number) {
		return await this.reportPostsService.deleteReports(reportId);
	}
}
