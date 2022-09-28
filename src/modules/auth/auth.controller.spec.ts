import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from 'src/entities/users.entity';
import { MockUsersRepository } from '../../../test/mock/users.mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoAuthStrategy } from './strategies/kakao-auth.strategy';

describe('AuthController', () => {
	let authController: AuthController;
	let authService: AuthService;
	let usersRepository: MockUsersRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			controllers: [AuthController],
			providers: [
				AuthService,
				KakaoAuthStrategy,
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
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
		usersRepository = module.get(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});
});
