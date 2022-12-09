import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthCodeType } from 'src/types/auth-code.types';
import { MockAuthCodesRepository } from 'test/mock/auth-codes.mock';
import { MockUsersRepository } from 'test/mock/users.mock';
import { AuthCodesController } from './auth-codes.controller';
import { AuthCodesService } from './auth-codes.service';
import { VerifyAuthCodeResponseDto } from './dto/verify-auth-code-response.dto';

describe('AuthCodesController', () => {
	let authCodesController: AuthCodesController;
	let authCodesRepository: MockAuthCodesRepository;
	let usersRepository: MockUsersRepository;

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
		authCodesRepository = module.get(getRepositoryToken(AuthCode));
		usersRepository = module.get(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(authCodesController).toBeDefined();
	});
	describe('generateSignUpAuthCode()', () => {
		it('이메일이 중복된다면 BadRequestException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);

			await expect(
				authCodesController.generateSignUpAuthCode({
					email: 'test@gmail.com',
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
	describe('verifySignUpAuthCode()', () => {
		it('회원가입 인증 코드를 확인한다.', async () => {
			const user = await usersRepository.find();
			const authCode = {
				id: 1,
				email: 'testtest@email.com',
				type: AuthCodeType.SignUp,
				code: 'asdfghh',
				updatedAt: new Date(),
			};
			authCodesRepository.createQueryBuilder().getOne.mockResolvedValue(authCode);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			authCodesRepository.update.mockResolvedValue(authCode);

			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authCodesController.verifySignUpAuthCode({
					email: authCode.email,
					code: authCode.code,
				}),
			).resolves.toEqual(new VerifyAuthCodeResponseDto({ email: user.email }));
		});
		it('인증코드가 없다면 NotFoundException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			authCodesRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);

			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authCodesController.verifySignUpAuthCode({
					email: 'test@gmail.com',
					code: '1234abcd',
				}),
			).rejects.toThrow(NotFoundException);
		});
		it('인증코드가 다르다면 BadRequestException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			const authCode = {
				id: 1,
				email: 'testtest@email.com',
				type: AuthCodeType.SignUp,
				code: 'asdfghh',
				updatedAt: new Date(),
			};
			authCodesRepository.createQueryBuilder().getOne.mockResolvedValue(authCode);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			authCodesRepository.update.mockResolvedValue(authCode);

			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authCodesController.verifySignUpAuthCode({
					email: 'test@gmail.com',
					code: '1234abcd',
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
	describe('generateFindPwAuthCode()', () => {
		it('이메일이 없다면 NotFoundException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);

			await expect(
				authCodesController.generateFindPwAuthCode({
					email: 'test@gmail.com',
				}),
			).rejects.toThrow(NotFoundException);
		});
	});
	describe('verifyFindPwAuthCode()', () => {
		it('비밀번호 찾기 인증 코드를 확인한다.', async () => {
			const user = await usersRepository.find();
			const authCode = {
				id: 1,
				email: 'testtest@email.com',
				type: AuthCodeType.FindPw,
				code: 'asdfghh',
				updatedAt: new Date(),
			};
			authCodesRepository.createQueryBuilder().getOne.mockResolvedValue(authCode);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			authCodesRepository.update.mockResolvedValue(authCode);

			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authCodesController.verifyFindPwAuthCode({
					email: authCode.email,
					code: authCode.code,
				}),
			).resolves.toEqual(new VerifyAuthCodeResponseDto({ email: user.email }));
		});
		it('인증코드가 없다면 NotFoundException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			authCodesRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);

			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authCodesController.verifyFindPwAuthCode({
					email: 'test@gmail.com',
					code: '1234abcd',
				}),
			).rejects.toThrow(NotFoundException);
		});
		it('인증코드가 다르다면 BadRequestException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			const authCode = {
				id: 1,
				email: 'testtest@email.com',
				type: AuthCodeType.FindPw,
				code: 'asdfghh',
				updatedAt: new Date(),
			};
			authCodesRepository.createQueryBuilder().getOne.mockResolvedValue(authCode);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			authCodesRepository.update.mockResolvedValue(authCode);

			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				authCodesController.verifyFindPwAuthCode({
					email: 'test@gmail.com',
					code: '1234abcd',
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
