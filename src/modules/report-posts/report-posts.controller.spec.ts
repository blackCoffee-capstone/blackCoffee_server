import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportPost } from 'src/entities/report-posts.entity';
import { MockReportPostsRepository } from 'test/mock/report-posts.mock';
import { ReportPostsController } from './report-posts.controller';
import { ReportPostsService } from './report-posts.service';

describe('ReportPostsController', () => {
	let controller: ReportPostsController;

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

		controller = module.get<ReportPostsController>(ReportPostsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
