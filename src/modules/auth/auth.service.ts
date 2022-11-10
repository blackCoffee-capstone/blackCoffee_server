import { HttpService } from '@nestjs/axios';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { JwtConfig, OauthConfig } from 'src/config/config.constant';
import { User } from 'src/entities/users.entity';
import { UserType } from 'src/types/users.types';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { OauthUserDto } from './dto/oauth-user.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { TokenRefreshResponseDto } from './dto/token-refresh-response.dto';
import { HashPassword } from './hash-password';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private hashPassword: HashPassword,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly httpService: HttpService,
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

	async login(user: UserResponseDto): Promise<LoginResponseDto> {
		try {
			const payload = { id: user.id, role: user.type };
			const jwtAccessTokenExpire: string = this.jwtAccessTokenExpireByType(user.type);

			const accessToken = this.jwtService.sign(payload, {
				secret: this.#jwtConfig.jwtAccessTokenSecret,
				expiresIn: jwtAccessTokenExpire,
			});
			const refreshToken = this.jwtService.sign(payload, {
				secret: this.#jwtConfig.jwtRefreshTokenSecret,
				expiresIn: this.#jwtConfig.jwtRefreshTokenExpire,
			});

			await this.updateUserIfNewUser(user);

			return new LoginResponseDto({
				accessToken,
				refreshToken,
				user,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async validateEmailPassword(email: string, password: string): Promise<UserResponseDto> {
		const types = [UserType.Admin, UserType.Normal];
		const foundUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.email = :email', { email })
			.andWhere('user.type IN (:...types)', { types })
			.getOne();

		if (!foundUser || !foundUser.password) {
			throw new NotFoundException('User is not found');
		} else if (!(await this.isValidPassword(foundUser.password, password))) {
			throw new UnauthorizedException('Password is incorrect');
		}
		return new UserResponseDto(foundUser);
	}

	async refresh(user: any) {
		try {
			const payload = { id: user.id, role: user.type };
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

	async getUserIdIfExist(id: number, role: UserType) {
		try {
			const user = await this.usersRepository.findOne({
				where: { id, type: role },
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
				.andWhere('user.social_id = :socialId', { socialId: oauthUser.socialId })
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

	private async isValidPassword(original: string, target: string) {
		return await this.hashPassword.equal({ password: target, hashPassword: original });
	}

	private async updateUserIfNewUser(user: UserResponseDto) {
		if (user.isNewUser) {
			await this.usersRepository.update(user.id, {
				isNewUser: false,
			});
		}
		return true;
	}

	private jwtAccessTokenExpireByType(userType: UserType): string {
		return userType === UserType.Admin
			? this.#jwtConfig.jwtAccessTokenExpireAdmin
			: this.#jwtConfig.jwtAccessTokenExpire;
	}
}
