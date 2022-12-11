import { Test, TestingModule } from '@nestjs/testing';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';

describe('AdsController', () => {
	let adsController: AdsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdsController],
			providers: [AdsService],
		}).compile();

		adsController = module.get<AdsController>(AdsController);
	});

	it('should be defined', () => {
		expect(adsController).toBeDefined();
	});
});
