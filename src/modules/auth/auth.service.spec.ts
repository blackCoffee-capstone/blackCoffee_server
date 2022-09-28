import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from 'src/entities/users.entity';
import { MockUsersRepository } from '../../../test/mock/users.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	let authService: AuthService;
	let usersRepository: MockUsersRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: HttpService,
					useValue: {
						//TODO:
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						post: jest.fn(() => {}),
					},
				},
				AuthService,
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'oauthConfig') {
								return 1;
							}
							return null;
						}),
					},
				},
			],
			// imports: [HttpModule],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		usersRepository = module.get<MockUsersRepository>(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});
});
