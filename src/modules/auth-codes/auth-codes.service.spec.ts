import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { MockAuthCodesRepository } from 'test/mock/auth-codes.mock';
import { MockUsersRepository } from 'test/mock/users.mock';
import { AuthCodesService } from './auth-codes.service';

describe('AuthCodesService', () => {
	let authCodesService: AuthCodesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthCodesService,
				{
					provide: MailerService,
					useValue: {
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						post: jest.fn(() => {}),
					},
				},
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

		authCodesService = module.get<AuthCodesService>(AuthCodesService);
	});

	it('should be defined', () => {
		expect(authCodesService).toBeDefined();
	});
});
