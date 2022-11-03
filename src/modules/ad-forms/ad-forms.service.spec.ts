import { Test, TestingModule } from '@nestjs/testing';
import { AdFormsService } from './ad-forms.service';

describe('AdFormsService', () => {
	let service: AdFormsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AdFormsService],
		}).compile();

		service = module.get<AdFormsService>(AdFormsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
