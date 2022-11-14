import { MailerService } from '@nestjs-modules/mailer';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { AuthCodeType } from 'src/types/auth-code.types';
import { MailAuthType } from 'src/types/mail-auth.types';
import { VerifyAuthCodeRequestDto } from './dto/verify-auth-code-request.dto';

@Injectable()
export class AuthCodesService {
	constructor(
		@InjectRepository(AuthCode)
		private readonly authCodesRepository: Repository<AuthCode>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly mailerService: MailerService,
	) {}

	async generateSignUpAuthCode(email: string) {
		const expiredAt: number = MailAuthType.ExpiredAt;
		const code: string = Math.random().toString(36).slice(2, 10).toString();
		const foundEmailUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.email = :email', { email })
			.getOne();
		if (foundEmailUser) {
			throw new BadRequestException('Email is already exist');
		}
		try {
			const foundAuthCode = await this.authCodesRepository
				.createQueryBuilder('userCode')
				.where('userCode.email = :email', { email })
				.getOne();

			if (foundAuthCode) {
				foundAuthCode.code = code;
				await this.authCodesRepository.save(foundAuthCode);
			} else {
				await this.authCodesRepository.save({
					email: email,
					type: AuthCodeType.SignUp,
					code: code,
				});
			}

			this.mailerService.sendMail({
				to: email,
				subject: '[지금,여기] 이메일 인증 메일입니다 :)',
				// TODO: Template
				html: `
			<p>지금,여기에 오신 것을 환영해요! 아래 인증 코드를 지금,여기 앱에서 입력해주세요.</p>
			<p>인증 코드: <span>${code}</span></p>
			<p>인증코드는 이메일 발송 시점으로부터 ${expiredAt.toString()}분 동안 유효합니다.</p>
			`,
			});

			return { expiredAt };
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async verifyAuthCode(authCode: VerifyAuthCodeRequestDto) {
		const foundAuthCode = await this.authCodesRepository
			.createQueryBuilder('authCode')
			.where('authCode.email = :email', { email: authCode.email })
			.getOne();

		if (!foundAuthCode) throw new NotFoundException('Auth code not found');

		const now = new Date();
		const expiredAt = foundAuthCode.updatedAt;
		const diffMinute = (now.getTime() - expiredAt.getTime()) / 1000 / 60;

		if (diffMinute > MailAuthType.ExpiredAt) {
			await this.authCodesRepository.delete(foundAuthCode.id);
			throw new ForbiddenException('Auth code expired');
		} else if (foundAuthCode.code !== authCode.code) {
			throw new BadRequestException('Auth code is incorrect');
		}
		await this.authCodesRepository.delete(foundAuthCode.id);
		return true;
	}
}
