import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportPost } from 'src/entities/report-posts.entity';
import { Repository } from 'typeorm';
import { UpdateReportsRequestDto } from './dto/update-reports-request.dto';

@Injectable()
export class ReportPostsService {
	constructor(
		@InjectRepository(ReportPost)
		private readonly reportPostsRepository: Repository<ReportPost>,
	) {}

	async updateReportsStatus(reportId: number, updateReportData: UpdateReportsRequestDto): Promise<boolean> {
		const foundReport = await this.foundReportData(reportId);
		if (!foundReport) {
			throw new NotFoundException('Report is not found');
		}
		await this.reportPostsRepository.update(reportId, updateReportData);
		return true;
	}

	private async foundReportData(reportId: number) {
		return await this.reportPostsRepository
			.createQueryBuilder('reportPost')
			.leftJoinAndSelect('reportPost.user', 'user')
			.leftJoinAndSelect('reportPost.post', 'post')
			.where('reportPost.id = :reportId', { reportId })
			.getOne();
	}
}
