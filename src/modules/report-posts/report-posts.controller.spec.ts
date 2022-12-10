import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getMaxListeners } from 'process';
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

	describe('getAllReport()', () => {
		it('신고 목록을 반환한다.', async () => {
			const reports = await reportPostsRepository.find();
			const expectReports = reports.map((item) => new ReportsResponseDto(item));
			reportPostsRepository.createQueryBuilder().getMany.mockResolvedValue(expectReports);

			await expect(reportPostscontroller.getAllReports({})).resolves.toEqual(expectReports);
		});
	});
});
