import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportPost } from 'src/entities/report-posts.entity';
import { AdFormType } from 'src/types/ad-form.types';
import { MockReportPostsRepository } from 'test/mock/report-posts.mock';
import { ReportsResponseDto } from './dto/reports-response.dto';
import { ReportPostsController } from './report-posts.controller';
import { ReportPostsService } from './report-posts.service';

describe('ReportPostsController', () => {
	let reportPostscontroller: ReportPostsController;
	let reportPostsRepository: MockReportPostsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ReportPostsController],
			providers: [
				ReportPostsService,
				{
					provide: getRepositoryToken(ReportPost),
					useClass: MockReportPostsRepository,
				},
			],
		}).compile();

		reportPostscontroller = module.get<ReportPostsController>(ReportPostsController);
		reportPostsRepository = module.get(getRepositoryToken(ReportPost));
	});

	it('should be defined', () => {
		expect(reportPostscontroller).toBeDefined();
	});

	describe('getAllReport()', () => {
		it('신고 목록을 반환한다.', async () => {
			const reports = await reportPostsRepository.find();
			const expectReports = reports.map((item) => new ReportsResponseDto(item));
			reportPostsRepository.createQueryBuilder().getMany.mockResolvedValue(expectReports);

			await expect(reportPostscontroller.getAllReports({})).resolves.toEqual(expectReports);
		});
	});
	describe('updateMultiReportsStatus()', () => {
		it('여러 신고 목록의 상태를 수정한다.', async () => {
			const reports = await reportPostsRepository.find();
			reportPostsRepository.createQueryBuilder().getMany.mockResolvedValue(reports);
			reportPostsRepository.update.mockResolvedValue(reports);

			await expect(
				reportPostscontroller.updateMultiReportsStatus({ reportIds: [1], status: AdFormType.Approve }),
			).resolves.toEqual(true);
		});
		it('신고 목록이 중복되면 BadRequestException 에러를 반환한다', async () => {
			// usersRepository.save.mockResolvedValue(user);

			await expect(
				reportPostscontroller.updateMultiReportsStatus({ reportIds: [1, 1], status: AdFormType.Approve }),
			).rejects.toThrow(BadRequestException);
		});
		it('신고글을 찾을 수 없는 경우 NotFoundException 에러를 반환한다', async () => {
			reportPostsRepository.createQueryBuilder().getMany.mockResolvedValue([1]);

			await expect(
				reportPostscontroller.updateMultiReportsStatus({ reportIds: [1, 3], status: AdFormType.Approve }),
			).rejects.toThrow(NotFoundException);
		});
	});
	describe('deleteReports()', () => {
		it('신고를 삭제한다.', async () => {
			const reports = await reportPostsRepository.find();
			reportPostsRepository.createQueryBuilder().getOne.mockResolvedValue(reports[0]);
			reportPostsRepository.delete.mockResolvedValue(true);

			await expect(reportPostscontroller.deleteReports(1)).resolves.toEqual(true);
		});
		it('신고글을 찾을 수 없는 경우 NotFoundException 에러를 반환한다', async () => {
			reportPostsRepository.createQueryBuilder().getOne.mockResolvedValue(null);

			await expect(reportPostscontroller.deleteReports(2)).rejects.toThrow(NotFoundException);
		});
	});
});
