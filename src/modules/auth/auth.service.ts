import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { JwtConfig, OauthConfig } from 'src/config/config.constant';
import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { AuthCodeType } from 'src/types/auth-code.types';
import { UserType } from 'src/types/users.types';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { KakaoLoginResponseDto } from './dto/kakao-login-response.dto';
import { KakaoUserDto } from './dto/kakao-user.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { TokenRefreshResponseDto } from './dto/token-refresh-response.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(AuthCode)
		private readonly authCodesRepository: Repository<AuthCode>,
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

	async createKakaoUser(kakaoUserData: KakaoUserDto): Promise<UserResponseDto> {
		try {
			let kakaoUser = await this.usersRepository.findOne({
				where: { socialId: kakaoUserData.kakaoId },
			});

			if (kakaoUser) return new UserResponseDto(kakaoUser);
			else {
				kakaoUser = await this.usersRepository.save({
					name: kakaoUserData.name,
					nickname: kakaoUserData.name,
					email: kakaoUserData.email,
					socialId: kakaoUserData.kakaoId,
					type: UserType.Kakao,
				});

				return new UserResponseDto(kakaoUser);
			}
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async login(user: UserResponseDto): Promise<KakaoLoginResponseDto> {
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

			return new KakaoLoginResponseDto({
				accessToken,
				refreshToken,
				user,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async signup(signUpRequestDto: SignUpRequestDto) {
		try {
			const foundUser = await this.usersRepository
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.authCode', 'authCode')
				.where('user.email = :email', { email: signUpRequestDto.email })
				.getOne();

			if (foundUser && foundUser.type === UserType.Normal) {
				// 이메일 중복 (일반)
				if (!foundUser.authCode) throw new BadRequestException('Email is already exist');
				// 이메일 인증 안한 경우
				else if (foundUser.authCode.type === AuthCodeType.SighUp) {
					throw new ForbiddenException('Email confirmation is required.');
				}
			}

			// 이메일 중복 (카카오)
			else if (foundUser && foundUser.type === UserType.Kakao) {
				throw new BadRequestException('User is kakao user');
			}

			// 인증메일 전송

			// authcode tbl 생성

			//TODO: Remove code after test
			else {
				const user = this.usersRepository.create({
					...signUpRequestDto,
					type: UserType.Normal,
				});

				const result = await this.usersRepository.save(user);
				await this.generateAuthCodeIfSignUp(result.id, result.email);
				return result;
			}
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
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

	private jwtAccessTokenExpireByType(userType: UserType): string {
		return userType === UserType.Admin
			? this.#jwtConfig.jwtAccessTokenExpireAdmin
			: this.#jwtConfig.jwtAccessTokenExpire;
	}

	// 회원가입 경우
	private async generateAuthCodeIfSignUp(userId: number, email: string) {
		// random code
		const code: string = Math.random().toString(36).slice(2, 10).toString();
		// authcode tbl 추가
		const authCode = await this.authCodesRepository.save({
			type: AuthCodeType.SighUp,
			code: code,
			userId: userId,
		});
		// 메일 전송
	}
}
