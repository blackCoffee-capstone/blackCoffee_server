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
import { AuthCodeResponseDto } from './dto/auth-code-response.dto';
import { VerifyAuthCodeRequestDto } from './dto/verify-auth-code-request.dto';
import { VerifyAuthCodeResponseDto } from './dto/verify-auth-code-response.dto';

@Injectable()
export class AuthCodesService {
	constructor(
		@InjectRepository(AuthCode)
		private readonly authCodesRepository: Repository<AuthCode>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly mailerService: MailerService,
	) {}

	async generateAuthCode(email: string, type: AuthCodeType): Promise<AuthCodeResponseDto> {
		const expiredAt: number = MailAuthType.ExpiredAt;
		const code: string = Math.random().toString(36).slice(2, 10).toString();

		if (await this.errIfExistEmailOrNot(email, type)) {
			try {
				let foundAuthCode = await this.authCodesRepository
					.createQueryBuilder('auth_code')
					.where('auth_code.email = :email', { email })
					.andWhere('auth_code.type = :type', { type })
					.getOne();

				if (foundAuthCode) {
					foundAuthCode.code = code;
					await this.authCodesRepository.save(foundAuthCode);
				} else if (type === AuthCodeType.SignUp) {
					foundAuthCode = await this.authCodesRepository
						.createQueryBuilder('auth_code')
						.where('auth_code.email = :email', { email })
						.andWhere('auth_code.type = :type', { type: AuthCodeType.SignUpAble })
						.getOne();
					if (foundAuthCode) throw new BadRequestException('Email is already verified');
					else {
						await this.authCodesRepository.save({
							email,
							type,
							code,
						});
					}
				} else {
					await this.authCodesRepository.save({
						email,
						type,
						code,
					});
				}

				this.sendAuthMail(type, email, code, expiredAt);
				return new AuthCodeResponseDto({ expiredAt });
			} catch (error) {
				throw new InternalServerErrorException(error.message, error);
			}
		}
	}

	async verifyAuthCode(authCode: VerifyAuthCodeRequestDto, type: AuthCodeType): Promise<VerifyAuthCodeResponseDto> {
		const foundAuthCode = await this.authCodesRepository
			.createQueryBuilder('auth_code')
			.where('auth_code.email = :email', { email: authCode.email })
			.andWhere('auth_code.type = :type', { type })
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
		await this.approveAuthCode(foundAuthCode, type);
		return new VerifyAuthCodeResponseDto({ email: authCode.email });
	}

	private async errIfExistEmailOrNot(email: string, type: AuthCodeType): Promise<boolean> {
		const foundEmailUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.email = :email', { email })
			.getOne();
		if (type === AuthCodeType.SignUp && foundEmailUser) {
			throw new BadRequestException('Email is already exist');
		} else if (type === AuthCodeType.FindPw && !foundEmailUser) {
			throw new NotFoundException('User is not found');
		}
		return true;
	}

	private async approveAuthCode(foundAuthCode: any, type: AuthCodeType): Promise<boolean> {
		if (type === AuthCodeType.FindPw) {
			await this.authCodesRepository.delete(foundAuthCode.id);
		} else if (type === AuthCodeType.SignUp) {
			await this.authCodesRepository.update(foundAuthCode.id, {
				type: AuthCodeType.SignUpAble,
				code: null,
			});
		}

		return true;
	}

	private sendAuthMail(type: AuthCodeType, email: string, code: string, expiredAt: number) {
		if (type === AuthCodeType.SignUp) {
			this.mailerService.sendMail({
				to: email,
				subject: '[??????,??????] ????????? ?????? ??????????????? :)',
				// TODO: Template
				html: `
			<p>??????,????????? ?????? ?????? ????????????! ?????? ?????? ????????? ??????,?????? ????????? ??????????????????.</p>
			<p>?????? ??????: <span>${code}</span></p>
			<p>??????????????? ????????? ?????? ?????????????????? ${expiredAt.toString()}??? ?????? ???????????????.</p>
			`,
			});
		} else if (type === AuthCodeType.FindPw) {
			this.mailerService.sendMail({
				to: email,
				subject: '[??????,??????] ????????? ?????? ??????????????? :)',
				// TODO: Template
				html: `
			<p>?????? ???????????? ????????? ?????? ???????????????! ?????? ?????? ????????? ??????,?????? ????????? ??????????????????.</p>
			<p>?????? ??????: <span>${code}</span></p>
			<p>??????????????? ????????? ?????? ?????????????????? ${expiredAt.toString()}??? ?????? ???????????????.</p>
			`,
			});
		}
	}
}
