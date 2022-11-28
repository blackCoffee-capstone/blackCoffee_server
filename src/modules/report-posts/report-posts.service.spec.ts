import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportPost } from 'src/entities/report-posts.entity';
import { MockReportPostsRepository } from 'test/mock/report-posts.mock';
import { ReportPostsService } from './report-posts.service';

describe('ReportPostsService', () => {
	let service: ReportPostsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReportPostsService,
				{
					provide: getRepositoryToken(ReportPost),
					useClass: MockReportPostsRepository,
				},
			],
		}).compile();

		service = module.get<ReportPostsService>(ReportPostsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
