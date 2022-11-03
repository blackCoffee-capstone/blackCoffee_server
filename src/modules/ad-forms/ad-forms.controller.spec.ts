import { Test, TestingModule } from '@nestjs/testing';
import { AdFormsController } from './ad-forms.controller';

describe('AdFormsController', () => {
	let controller: AdFormsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdFormsController],
		}).compile();

		controller = module.get<AdFormsController>(AdFormsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
