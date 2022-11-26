import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Ad } from 'src/entities/ad.entity';
import { AdForm } from 'src/entities/ad-form.entity';
import { Location } from 'src/entities/locations.entity';
import { MockAdsRepository } from 'test/mock/ads.mock';
import { MockAdFormsRepository } from 'test/mock/ad-forms.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { ConfigService } from '@nestjs/config';

describe('AdminsController', () => {
	let adminsController: AdminsController;
	let adminsService: AdminsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminsController],
			providers: [
				AdminsService,
				{
					provide: getRepositoryToken(Ad),
					useClass: MockAdsRepository,
				},
				{
					provide: getRepositoryToken(AdForm),
					useClass: MockAdFormsRepository,
				},
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'ncloudConfig') {
								return 1;
							}
							return null;
						}),
					},
				},
			],
		}).compile();

		adminsController = module.get<AdminsController>(AdminsController);
		adminsService = module.get<AdminsService>(AdminsService);
	});

	it('should be defined', () => {
		expect(adminsController).toBeDefined();
	});
});
