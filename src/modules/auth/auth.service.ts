import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { OauthConfig } from 'src/config/config.constant';
import { User } from 'src/entities/users.entity';
import { UserType } from 'src/types/users.types';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { KakaoUserDto } from './dto/kakao-user.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
	) {}
	#oauthConfig = this.configService.get<OauthConfig>('oauthConfig').kakao;

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
}
