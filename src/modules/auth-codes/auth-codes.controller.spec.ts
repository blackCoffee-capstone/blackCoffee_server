import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthCode } from 'src/entities/auth-code.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MockAuthCodesRepository } from 'test/mock/auth-codes.mock';
import { AuthCodesController } from './auth-codes.controller';
import { AuthCodesService } from './auth-codes.service';

describe('AuthCodesController', () => {
	let authCodesController: AuthCodesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [MailerModule],
			controllers: [AuthCodesController],
			providers: [
				AuthCodesService,
				{
					provide: getRepositoryToken(AuthCode),
					useClass: MockAuthCodesRepository,
				},
			],
		}).compile();

		authCodesController = module.get<AuthCodesController>(AuthCodesController);
	});

	it('should be defined', () => {
		expect(authCodesController).toBeDefined();
	});
});
