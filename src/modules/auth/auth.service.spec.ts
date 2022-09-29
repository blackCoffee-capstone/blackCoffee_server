import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthCode } from 'src/entities/auth-code.entity';

import { User } from 'src/entities/users.entity';
import { MockUsersRepository } from '../../../test/mock/users.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	let authService: AuthService;
	let usersRepository: MockUsersRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: HttpService,
					useValue: {
						//TODO:
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						post: jest.fn(() => {}),
					},
				},
				{
					provide: JwtService,
					useValue: {
						sign: () => '',
					},
				},
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
				{
					provide: getRepositoryToken(AuthCode),
					useClass: MockUsersRepository,
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'jwtConfig' || key === 'oauthConfig') {
								return 1;
							}
							return null;
						}),
					},
				},
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		usersRepository = module.get<MockUsersRepository>(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});
});
