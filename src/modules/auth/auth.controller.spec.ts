import { HttpModule } from '@nestjs/axios';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';

import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserType } from 'src/types/users.types';
import { MockAuthCodesRepository } from 'test/mock/auth-codes.mock';
import { MockUsersRepository } from '../../../test/mock/users.mock';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { HashPassword } from './hash-password';
import { FacebookAuthStrategy } from './strategies/facebook-auth.strategy';
import { KakaoAuthStrategy } from './strategies/kakao-auth.strategy';

describe('AuthController', () => {
	let authController: AuthController;
	let authService: AuthService;
	let usersRepository: MockUsersRepository;
	let authCodesRepository: MockAuthCodesRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule, MailerModule],
			controllers: [AuthController],
			providers: [
				AuthService,
				HashPassword,
				{
					provide: JwtService,
					useValue: {
						sign: () => '',
					},
				},
				KakaoAuthStrategy,
				FacebookAuthStrategy,
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
				{
					provide: getRepositoryToken(AuthCode),
					useClass: MockAuthCodesRepository,
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

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
		usersRepository = module.get(getRepositoryToken(User));
		authCodesRepository = module.get(getRepositoryToken(AuthCode));
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});
	describe('signUp()', () => {
		it('??????????????? ???????????? ????????? ????????? ????????????.', async () => {
			const user = await usersRepository.find();
			const authCode = await authCodesRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			authCodesRepository.createQueryBuilder().getOne.mockResolvedValue(authCode);
			authCodesRepository.delete.mockResolvedValue(authCode);
			usersRepository.create.mockResolvedValue(user);
			usersRepository.save.mockResolvedValue(user);

			await expect(
				authController.signUp({
					email: user.email,
					password: user.password,
					name: user.name,
					nickname: user.nickname,
				}),
			).resolves.toEqual(new UserResponseDto(user));
		});
		it('???????????? ??????????????? BadRequestException ????????? ????????????.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);
			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authController.signUp({
					email: user.email,
					password: user.password,
					name: user.name,
					nickname: user.nickname,
				}),
			).rejects.toThrow(BadRequestException);
		});
		it('?????????/????????????/?????? ????????? ????????? ?????? BadRequestException ????????? ????????????.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authController.signUp({
					email: user.email,
					password: 'a',
					name: user.name,
					nickname: user.nickname,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
	describe('login()', () => {
		it('???????????? ???????????? ????????? ?????? ????????? ????????????.', async () => {
			const user = await usersRepository.find();
			await expect(authController.login(new UserResponseDto(user))).toBeInstanceOf(Promise<LoginResponseDto>);
		});
	});
	describe('adminLogin()', () => {
		it('????????? ???????????? ???????????? ????????? ?????? ????????? ????????????.', async () => {
			const user = await usersRepository.find();
			user.type = UserType.Admin;
			await expect(authController.adminLogin(new UserResponseDto(user))).toBeInstanceOf(
				Promise<LoginResponseDto>,
			);
		});
		it('????????? ????????? ???????????? UnauthorizedException ????????? ????????????.', async () => {
			const user = await usersRepository.find();
			user.type = UserType.Normal;
			await expect(authController.adminLogin(new UserResponseDto(user))).rejects.toThrow(UnauthorizedException);
		});
	});
	describe('generateTempPw()', () => {
		it('???????????? ????????? NotFoundException ????????? ????????????.', async () => {
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			await expect(authController.generateTempPw({ email: 'tnals1178@gmail.com' })).rejects.toThrow(
				NotFoundException,
			);
		});
	});
	describe('logout()', () => {
		it('true??? ????????????.', async () => {
			const user = await usersRepository.find();
			await expect(authController.logout(new UserResponseDto(user))).resolves.toEqual(true);
		});
	});
	describe('deleteUser()', () => {
		it('true??? ????????????.', async () => {
			const user = await usersRepository.find();
			const saltOrRounds = 10;
			const hashPw = await hash('1234abcd!', saltOrRounds);

			usersRepository.findOne.mockResolvedValue({ ...user, password: hashPw });
			usersRepository.delete.mockResolvedValue(user);

			await expect(
				authController.deleteUser(new UserResponseDto(user), { password: '1234abcd!' }),
			).resolves.toEqual(true);
		});
		it('??????????????? ???????????? ????????? UnauthorizedException ????????? ????????????.', async () => {
			const user = await usersRepository.find();
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authController.deleteUser(new UserResponseDto(user), { password: '1234abcd!' }),
			).rejects.toThrow(UnauthorizedException);
		});
	});
});
