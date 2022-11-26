import { Body, Controller, Delete, Get, HttpCode, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/types/users.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { UpdateReportsRequestDto } from './dto/update-reports-request.dto';
import { ApiDocs } from './report-posts.docs';
import { ReportPostsService } from './report-posts.service';

@Controller('report-posts')
@ApiTags('report-posts - 신고글 정보')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles(UserType.Admin)
export class ReportPostsController {
	constructor(private readonly reportPostsService: ReportPostsService) {}

	@Get()
	@ApiDocs.getAllReports('신고 목록 반환')
	async getAllReports() {
		return await this.reportPostsService.getAllReports();
	}

	@Patch(':reportId')
	@ApiDocs.updateReportsStatus('신고 상태 수정하기')
	async updateReportsStatus(@Param('reportId') reportId: number, @Body() updateReportData: UpdateReportsRequestDto) {
		return await this.reportPostsService.updateReportsStatus(reportId, updateReportData);
	}

	@HttpCode(204)
	@Delete(':reportId')
	@ApiDocs.deleteReports('신고 삭제하기')
	async deleteReports(@Param('reportId') reportId: number) {
		return await this.reportPostsService.deleteReports(reportId);
	}
}
