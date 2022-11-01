import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { JwtConfig, OauthConfig } from 'src/config/config.constant';
import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { AuthCodeType } from 'src/types/auth-code.types';
import { MailAuthType } from 'src/types/mail-auth.types';
import { UserType } from 'src/types/users.types';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthCodeDto } from './dto/auth-code.dto';
import { OauthLoginResponseDto } from './dto/oauth-login-response.dto';
import { OauthUserDto } from './dto/oauth-user.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { TokenRefreshResponseDto } from './dto/token-refresh-response.dto';
import { HashPassword } from './hash-password';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(AuthCode)
		private readonly authCodesRepository: Repository<AuthCode>,
		private hashPassword: HashPassword,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly httpService: HttpService,
		private readonly mailerService: MailerService,
	) {}
	#oauthConfig = this.configService.get<OauthConfig>('oauthConfig').kakao;
	#jwtConfig = this.configService.get<JwtConfig>('jwtConfig');

	//Test
	getKakaoLoginPage(): string {
		return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
			this.#oauthConfig.clientId
		}&redirect_uri=${this.#oauthConfig.callbackUrl}`;
	}

	//Test
	async test(code: string) {
		const kakao_api_url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${
			this.#oauthConfig.clientId
		}&redirect_url=${this.#oauthConfig.callbackUrl}&code=${code}`;
		const token_res = await firstValueFrom(this.httpService.post(kakao_api_url));
		const access_token: string = token_res.data.access_token;
		return access_token;
	}

	async createOauthUser(oauthUserData: OauthUserDto, userType: UserType): Promise<UserResponseDto> {
		if (oauthUserData.email) {
			let compareUser = await this.usersRepository.findOne({
				where: { email: oauthUserData.email },
			});

			if (compareUser) {
				if (this.oauthUserIsCompareUser(compareUser, oauthUserData, userType))
					return new UserResponseDto(compareUser);
				else await this.errIfDuplicateEmail(compareUser);
			} else {
				if ((compareUser = await this.getOauthUserIfExist(oauthUserData, userType)))
					return new UserResponseDto(compareUser);
				else {
					const newOauthUser = await this.usersRepository.save({
						name: oauthUserData.name,
						nickname: oauthUserData.name,
						email: oauthUserData.email,
						socialId: oauthUserData.socialId,
						type: userType,
					});

					return new UserResponseDto(newOauthUser);
				}
			}
		} else {
			const oauthUser = await this.getOauthUserIfExist(oauthUserData, userType);
			if (oauthUser) return new UserResponseDto(oauthUser);
			else {
				try {
					const newOauthUser = await this.usersRepository.save({
						name: oauthUserData.name,
						nickname: oauthUserData.name,
						socialId: oauthUserData.socialId,
						type: userType,
					});
					return new UserResponseDto(newOauthUser);
				} catch (error) {
					throw new InternalServerErrorException(error.message, error);
				}
			}
		}
	}

	async signUp(signUpRequestDto: SignUpRequestDto): Promise<UserResponseDto> {
		const foundUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.email = :email', { email: signUpRequestDto.email })
			.getOne();

		if (await this.errIfDuplicateEmail(foundUser)) {
			signUpRequestDto.password = await this.hashPassword.hash(signUpRequestDto.password);
			const user = this.usersRepository.create({
				...signUpRequestDto,
				type: UserType.Normal,
			});

			const result = await this.usersRepository.save(user);
			return new UserResponseDto(result);
		}
	}

	async login(user: UserResponseDto): Promise<OauthLoginResponseDto> {
		try {
			const payload = { id: user.id };
			const jwtAccessTokenExpire: string = this.jwtAccessTokenExpireByType(user.type);

			const accessToken = this.jwtService.sign(payload, {
				secret: this.#jwtConfig.jwtAccessTokenSecret,
				expiresIn: jwtAccessTokenExpire,
			});
			const refreshToken = this.jwtService.sign(payload, {
				secret: this.#jwtConfig.jwtRefreshTokenSecret,
				expiresIn: this.#jwtConfig.jwtRefreshTokenExpire,
			});

			return new OauthLoginResponseDto({
				accessToken,
				refreshToken,
				user,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async generateAuthCodeIfSignUp(user: UserResponseDto): Promise<SignUpResponseDto> {
		const expiredAt: string = MailAuthType.ExpiredAt;
		const code: string = Math.random().toString(36).slice(2, 10).toString();

		try {
			await this.authCodesRepository.save({
				type: AuthCodeType.SignUp,
				code: code,
				userId: user.id,
			});

			this.mailerService.sendMail({
				to: user.email,
				subject: '[지금,여기] 이메일 인증 메일입니다 :)',
				// TODO: Template
				html: `
			<p>지금,여기에 오신 것을 환영해요! 아래 인증 코드를 지금,여기 앱에서 입력해주세요.</p>
			<p>인증 코드: <span>${code}</span></p>
			<p>인증코드는 이메일 발송 시점으로부터 ${expiredAt} 동안 유효합니다.</p>
			`,
			});

			return new SignUpResponseDto({ ...user, expiredAt });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async verifyAuthCode(authCode: AuthCodeDto) {
		//TODO: 수정 예정
		// const foundUser = await this.usersRepository
		// 	.createQueryBuilder('user')
		// 	.leftJoinAndSelect('user.authCode', 'authCode')
		// 	.where('user.email = :email', { email: authCode.email })
		// 	.getOne();

		// if (!foundUser) {
		// 	throw new NotFoundException('Email not found');
		// } else if (!foundUser.authCode) {
		// 	throw new NotFoundException('Auth code not found');
		// } else if (foundUser.authCode.type !== authCode.type) {
		// 	throw new BadRequestException('Type is incorrect');
		// }

		// const now = new Date();
		// const expiredAt = foundUser.authCode.createdAt;
		// const diffMinute = (now.getTime() - expiredAt.getTime()) / 1000 / 60;

		// if (diffMinute > 10) {
		// 	throw new ForbiddenException('Auth code expired');
		// } else if (foundUser.authCode.code !== authCode.code) {
		// 	throw new ForbiddenException('Auth code is incorrect');
		// }
		// await this.authCodesRepository.delete(foundUser.authCode.id);
		return true;
	}

	async refresh(user: any) {
		try {
			const payload = { id: user.id };
			const jwtAccessTokenExpire: string = this.jwtAccessTokenExpireByType(user.type);

			const newAccessToken = this.jwtService.sign(payload, {
				secret: this.#jwtConfig.jwtAccessTokenSecret,
				expiresIn: jwtAccessTokenExpire,
			});
			return new TokenRefreshResponseDto({ accessToken: newAccessToken });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getUserIdIfExist(id: number) {
		try {
			const user = await this.usersRepository.findOne({
				where: { id },
			});
			if (user) {
				return { id: user.id, type: user.type };
			} else throw new UnauthorizedException();
		} catch (error) {
			throw new UnauthorizedException();
		}
	}

	private oauthUserIsCompareUser(compareUser: any, oauthUser: OauthUserDto, userType: UserType): boolean {
		if (compareUser.type === userType && compareUser.socialId == oauthUser.socialId) return true;
		return false;
	}

	private async getOauthUserIfExist(oauthUser: OauthUserDto, userType: UserType) {
		try {
			const user = await this.usersRepository
				.createQueryBuilder('user')
				.where('user.type = :type', { type: userType })
				.andWhere('user.social_id = :socialId', { socialId: oauthUser.socialId }) //TODO: test
				.getOne();

			return user;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async errIfDuplicateEmail(user) {
		if (user && user.type === UserType.Normal) {
			throw new BadRequestException('Email is already exist');
		} else if (user && user.type === UserType.Kakao) {
			throw new BadRequestException('User is kakao user');
		} else if (user && user.type === UserType.Facebook) {
			throw new BadRequestException('User is facebook user');
		} else return true;
	}

	private jwtAccessTokenExpireByType(userType: UserType): string {
		return userType === UserType.Admin
			? this.#jwtConfig.jwtAccessTokenExpireAdmin
			: this.#jwtConfig.jwtAccessTokenExpire;
	}
}
