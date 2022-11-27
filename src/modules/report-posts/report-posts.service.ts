import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportPost } from 'src/entities/report-posts.entity';
import { AdFormType } from 'src/types/ad-form.types';
import { In, Repository } from 'typeorm';
import { PostsResponseDto } from '../posts/dto/posts-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AllReportsRequestDto } from './dto/all-reports-request.dto';
import { ReportsResponseDto } from './dto/reports-response.dto';
import { UpdateMultiReportsRequestDto } from './dto/update-multi-reports-request.dto';
import { UpdateReportsRequestDto } from './dto/update-reports-request.dto';

@Injectable()
export class ReportPostsService {
	constructor(
		@InjectRepository(ReportPost)
		private readonly reportPostsRepository: Repository<ReportPost>,
	) {}

	async getAllReports(filter: AllReportsRequestDto): Promise<ReportsResponseDto[]> {
		let foundAllReports = this.reportPostsRepository
			.createQueryBuilder('reportPost')
			.leftJoinAndSelect('reportPost.user', 'user')
			.leftJoinAndSelect('reportPost.post', 'post');

		if (filter && filter.status) {
			foundAllReports = foundAllReports.where('reportPost.status = :status', { status: filter.status });
		}
		if (filter && filter.postId) {
			foundAllReports = foundAllReports.andWhere('post.id = :postId', { postId: filter.postId });
		}
		const foundReportsQuery = await foundAllReports.orderBy('reportPost.created_at', 'DESC').getMany();
		return foundReportsQuery.map(
			(report) =>
				new ReportsResponseDto({
					...report,
					user: new UserResponseDto(report.user),
					post: new PostsResponseDto(report.post),
				}),
		);
	}

	async updateMultiReportsStatus(multiReportData: UpdateMultiReportsRequestDto): Promise<boolean> {
		if (this.isDuplicateArr(multiReportData.reportIds)) {
			throw new BadRequestException(`Duplicate value exists in user's reportId list`);
		}
		if (await this.notFoundThemes(multiReportData.reportIds)) {
			throw new NotFoundException('Report is not found');
		}
		await this.reportPostsRepository.update(
			{
				id: In(multiReportData.reportIds),
			},
			{ status: multiReportData.status },
		);
		return true;
	}

	async updateReportsStatus(reportId: number, updateReportData: UpdateReportsRequestDto): Promise<boolean> {
		const foundReport = await this.foundReportData(reportId);
		if (!foundReport) {
			throw new NotFoundException('Report is not found');
		}
		await this.reportPostsRepository.update(reportId, updateReportData);
		return true;
	}

	async deleteReports(reportId: number): Promise<boolean> {
		const foundReport = await this.foundReportData(reportId);
		if (!foundReport) {
			throw new NotFoundException('Report is not found');
		}
		await this.reportPostsRepository.delete(reportId);
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

	private async foundFilterReportDatas(status: AdFormType) {
		return await this.reportPostsRepository
			.createQueryBuilder('reportPost')
			.leftJoinAndSelect('reportPost.user', 'user')
			.leftJoinAndSelect('reportPost.post', 'post')
			.where('reportPost.status = :status', { status })
			.orderBy('reportPost.created_at', 'DESC')
			.getMany();
	}

	private isDuplicateArr(arr: any): boolean {
		const set = new Set(arr);

		if (arr.length !== set.size) return true;
		return false;
	}

	private async notFoundThemes(reportIds: number[]): Promise<boolean> {
		const foundThemes = await this.reportPostsRepository
			.createQueryBuilder('reportPost')
			.where('reportPost.id IN (:...reportIds)', { reportIds })
			.getMany();

		if (foundThemes.length !== reportIds.length) return true;
		return false;
	}
}
