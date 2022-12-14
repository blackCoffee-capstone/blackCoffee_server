import { MailerService } from '@nestjs-modules/mailer';
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
import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { AuthCodeType } from 'src/types/auth-code.types';
import { UserType } from 'src/types/users.types';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { DeleteUserRequestDto } from './dto/delete-user-request.dto';
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
		@InjectRepository(AuthCode)
		private readonly authCodesRepository: Repository<AuthCode>,
		private hashPassword: HashPassword,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly httpService: HttpService,
		private readonly mailerService: MailerService,
	) {}
	#oauthConfig = this.configService.get<OauthConfig>('oauthConfig').kakao;
	#facebookConfig = this.configService.get<OauthConfig>('oauthConfig').facebook;
	#jwtConfig = this.configService.get<JwtConfig>('jwtConfig');

	//Test
	getFacebookLoginPage(): string {
		return `https://www.facebook.com/v2.11/dialog/oauth?client_id=${this.#facebookConfig.clientId}&redirect_uri=${
			this.#facebookConfig.callbackUrl
		}`;
	}

	//Test
	async getKakaoAccessToken(code: string): Promise<string> {
		try {
			const kakao_api_url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${
				this.#oauthConfig.clientId
			}&redirect_url=${this.#oauthConfig.callbackUrl}&code=${code}`;
			const token_res = await firstValueFrom(this.httpService.post(kakao_api_url));
			const access_token: string = token_res.data.access_token;
			return access_token;
		} catch (error) {
			throw new BadRequestException('Code is not valid');
		}
	}

	async getKakaoUserData(accessToken: string): Promise<OauthUserDto> {
		if (!accessToken) throw new UnauthorizedException();

		const validateTokenResult: any = await this.ValidateTokenAndDecode(accessToken);
		if (!validateTokenResult.id) throw new UnauthorizedException();

		const kakaoAccount = validateTokenResult.kakao_account;
		return new OauthUserDto({
			name: kakaoAccount.profile.nickname,
			socialId: validateTokenResult.id,
			email: kakaoAccount.has_email && !kakaoAccount.email_needs_agreement ? kakaoAccount.email : null,
		});
	}

	private async ValidateTokenAndDecode(accessToken: string): Promise<any> {
		try {
			const kakaoRequestApiResult = await firstValueFrom(
				this.httpService.get('https://kapi.kakao.com/v2/user/me', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}),
			);
			return kakaoRequestApiResult.data;
		} catch (error) {
			throw new BadRequestException('Access Token is not valid');
		}
	}

	async createOauthUser(oauthUserData: OauthUserDto, userType: UserType): Promise<UserResponseDto> {
		const userNickname: string = userType + oauthUserData.socialId.toString();

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
						nickname: userNickname,
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
						nickname: userNickname,
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

		if (
			(await this.errIfDuplicateEmail(foundUser)) &&
			(await this.errIfNotVerifyEmail(signUpRequestDto)) &&
			(await this.errIfDuplicateNickname(signUpRequestDto)) &&
			this.pwCheck(signUpRequestDto.password) &&
			this.nickNameFormat(signUpRequestDto.nickname) &&
			this.nameFormat(signUpRequestDto.name)
		) {
			signUpRequestDto.password = await this.hashPassword.hash(signUpRequestDto.password);
			const user = this.usersRepository.create({
				...signUpRequestDto,
				type: UserType.Normal,
			});
			await this.authCodesRepository.delete({ email: signUpRequestDto.email });
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

			return new LoginResponseDto({
				accessToken,
				refreshToken,
				user,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async adminLogin(user: UserResponseDto): Promise<LoginResponseDto> {
		if (user.type !== UserType.Admin) {
			throw new UnauthorizedException('User is not admin');
		}
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

	async generateTempPw(email: string): Promise<boolean> {
		const foundEmailUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.email = :email', { email })
			.getOne();
		if (!foundEmailUser) {
			throw new NotFoundException('User is not found');
		}

		const tempPw: string = this.getTmpPw();
		const tempHashPw = await this.hashPassword.hash(tempPw);
		await this.usersRepository.update(foundEmailUser.id, {
			password: tempHashPw,
		});

		this.mailerService.sendMail({
			to: email,
			subject: '[??????,??????] ?????? ???????????? ?????? ??????????????? :)',
			html: `
		<p>??????,?????? ????????? ?????????! ?????? ?????? ??????????????? ??????,?????? ?????? ?????????????????????.</p>
		<p>?????? ????????????: <span>${tempPw}</span></p>
		`,
		});
		return true;
	}

	async deleteUser(id: number, passwordData: DeleteUserRequestDto) {
		const user = await this.usersRepository.findOne({
			where: { id },
		});

		if (await this.isValidPassword(user.password, passwordData.password)) {
			await this.usersRepository.delete({ id });
			return true;
		} else throw new UnauthorizedException('Password is incorrect');
	}

	async getUserIdIfExist(id: number, role: UserType) {
		const user = await this.usersRepository.findOne({
			where: { id, type: role },
		});
		if (user) {
			return { id: user.id, type: user.type };
		} else throw new NotFoundException('User is not found');
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
		} else if (user && user.type === UserType.Admin) {
			throw new BadRequestException('User is admin user');
		} else return true;
	}

	private async errIfNotVerifyEmail(signUpRequestDto: SignUpRequestDto) {
		const foundAuthCodeUser = await this.authCodesRepository
			.createQueryBuilder('auth_code')
			.where('auth_code.email = :email', { email: signUpRequestDto.email })
			.getOne();

		if (!foundAuthCodeUser || foundAuthCodeUser.type === AuthCodeType.SignUp) {
			throw new BadRequestException('User did not verify the email');
		} else if (foundAuthCodeUser.type === AuthCodeType.SignUpAble) {
			return true;
		}
		return true;
	}

	private async errIfDuplicateNickname(signUpRequestDto: SignUpRequestDto) {
		const foundNicknameUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.nickname = :nickname', { nickname: signUpRequestDto.nickname })
			.getOne();

		if (foundNicknameUser) {
			throw new BadRequestException('Nickname is already exist');
		} else return true;
	}

	private async isValidPassword(original: string, target: string) {
		return await this.hashPassword.equal({ password: target, hashPassword: original });
	}

	private jwtAccessTokenExpireByType(userType: UserType): string {
		return userType === UserType.Admin
			? this.#jwtConfig.jwtAccessTokenExpireAdmin
			: this.#jwtConfig.jwtAccessTokenExpire;
	}

	private pwCheck(newPW: string): boolean {
		// 8~15?????? ?????? ??????, ????????????, ?????? 1??? ?????????
		if (newPW.length > 15 || newPW.length < 8) throw new BadRequestException('Password is not valid');
		const reg_pw = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[?!@#$%^&*()+=_-]).{8,15}/;
		const pass = reg_pw.test(newPW);
		if (pass) return true;
		else throw new BadRequestException('Password is not valid');
	}

	private nickNameFormat(nickname: string): boolean {
		// 4byte ??????, 18??? ??????
		const regex_nick = /^[???-???a-zA-Z0-9~!?@#$%^&*+=()[\]/'",.<>:;_-]+$/;
		// 4byte ??????, 18??? ??????
		if (this.getByte(nickname) >= 4 && nickname.length <= 18 && regex_nick.test(nickname)) {
			return true;
		} else {
			throw new BadRequestException('Nickname is not valid');
		}
	}

	private nameFormat(name: string): boolean {
		const regex_name = /^[???-???]{2,8}|[a-zA-Z]{2,16}$/;
		if (this.getByte(name) <= 16 && regex_name.test(name)) {
			return true;
		} else {
			throw new BadRequestException('Name is not valid');
		}
	}
	private getByte(str: string) {
		const strLength = str.length;
		let strByteLength = 0;
		for (let i = 0; i < strLength; i++) {
			if (escape(str.charAt(i)).length >= 4) strByteLength += 2;
			else if (escape(str.charAt(i)) == '%A7') strByteLength += 2;
			else if (escape(str.charAt(i)) != '%0D') strByteLength++;
		}
		return strByteLength;
	}

	private getTmpPw(): string {
		const ranValue1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
		const ranValue2 = [
			'A',
			'B',
			'C',
			'D',
			'E',
			'F',
			'G',
			'H',
			'I',
			'J',
			'K',
			'L',
			'M',
			'N',
			'O',
			'P',
			'Q',
			'R',
			'S',
			'T',
			'U',
			'V',
			'W',
			'X',
			'Y',
			'Z',
		];
		const ranValue3 = [
			'a',
			'b',
			'c',
			'd',
			'e',
			'f',
			'g',
			'h',
			'i',
			'j',
			'k',
			'l',
			'm',
			'n',
			'o',
			'p',
			'q',
			'r',
			's',
			't',
			'u',
			'v',
			'w',
			'x',
			'y',
			'z',
		];
		const ranValue4 = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

		let temp_pw = '';

		for (let i = 0; i < 2; i++) {
			const ranPick1 = Math.floor(Math.random() * ranValue1.length);
			const ranPick2 = Math.floor(Math.random() * ranValue2.length);
			const ranPick3 = Math.floor(Math.random() * ranValue3.length);
			const ranPick4 = Math.floor(Math.random() * ranValue4.length);
			temp_pw = temp_pw + ranValue1[ranPick1] + ranValue2[ranPick2] + ranValue3[ranPick3] + ranValue4[ranPick4];
		}
		return temp_pw;
	}
}
