import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MockAuthCodesRepository } from 'test/mock/auth-codes.mock';
import { MockUsersRepository } from 'test/mock/users.mock';
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
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
			],
		}).compile();

		authCodesController = module.get<AuthCodesController>(AuthCodesController);
	});

	it('should be defined', () => {
		expect(authCodesController).toBeDefined();
	});
});
