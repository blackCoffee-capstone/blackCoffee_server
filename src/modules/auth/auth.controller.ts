import { Body, Controller, Get, Header, Post, Redirect, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthUser, FacebookUser } from 'src/decorators/auth.decorator';
import { UserType } from 'src/types/users.types';
import { AuthCodeRequestDto } from '../auth-codes/dto/auth-code-request.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { ApiDocs } from './auth.docs';
import { AuthService } from './auth.service';
import { DeleteUserRequestDto } from './dto/delete-user-request.dto';
import { KakaoLoginRequestDto } from './dto/kakao-login-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { OauthUserDto } from './dto/oauth-user.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/kakao-login')
	@ApiDocs.kakaoLogin('카카오 로그인 회원가입&로그인 후 유저 정보, 토큰 반환')
	async kakaoLogin(@Body() codeReq: KakaoLoginRequestDto) {
		const accessToken: string = await this.authService.getKakaoAccessToken(codeReq.code);
		const kakaoUser: OauthUserDto = await this.authService.getKakaoUserData(accessToken);
		const user: UserResponseDto = await this.authService.createOauthUser(kakaoUser, UserType.Kakao);
		return this.authService.login(user);
	}

	//Test - facebook
	@Get('/facebook-login')
	@Header('Content-Type', 'text/html')
	@Redirect()
	@ApiDocs.getFacebookLoginPage('페이스북 로그인 페이지로 리디렉트')
	getFacebookLoginPage() {
		const facebookeCallbackUrl: string = this.authService.getFacebookLoginPage();
		return {
			url: facebookeCallbackUrl,
		};
	}

	//Test - facebook
	@Get('/facebook-callback')
	@ApiDocs.facebookLogin2('페이스북 로그인 회원가입&로그인 후 유저 정보, 토큰 반환')
	async facebookLogin2(@FacebookUser() facebookUser) {
		// const user: UserResponseDto = await this.authService.createOauthUser(
		// 	facebookUser as OauthUserDto,
		// 	UserType.Facebook,
		// );
		// return this.authService.login(user);
	}

	@UseGuards(FacebookAuthGuard)
	@Post('/facebook-login')
	@ApiDocs.facebookLogin('페이스북 로그인 회원가입&로그인 후 유저 정보, 토큰 반환')
	async facebookLogin(@Body('facebookUser') facebookUser) {
		const user: UserResponseDto = await this.authService.createOauthUser(
			facebookUser as OauthUserDto,
			UserType.Facebook,
		);
		return this.authService.login(user);
	}

	@Post('/signup')
	@ApiDocs.signUp('일반 회원가입')
	async signUp(@Body() user: SignUpRequestDto) {
		return await this.authService.signUp(user);
	}

	@Post('/login')
	@ApiDocs.login('일반 로그인')
	@UseGuards(LocalAuthGuard)
	@ApiBody({ type: LoginRequestDto })
	async login(@AuthUser() user: UserResponseDto) {
		return await this.authService.login(user);
	}

	@Post('/admin-login')
	@ApiDocs.adminLogin('관리자 로그인')
	@UseGuards(LocalAuthGuard)
	@ApiBody({ type: LoginRequestDto })
	async adminLogin(@AuthUser() user: UserResponseDto) {
		return await this.authService.adminLogin(user);
	}

	@UseGuards(JwtRefreshGuard)
	@Post('token-refresh')
	@ApiDocs.refreshToken('access token 재발급')
	async refreshToken(@AuthUser() user) {
		return await this.authService.refresh(user);
	}

	@Post('find-pw')
	@ApiDocs.generateTempPw('임시 비밀번호 메일로 발송')
	async generateTempPw(@Body() authCodeReq: AuthCodeRequestDto) {
		return await this.authService.generateTempPw(authCodeReq.email);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@ApiDocs.logout('로그아웃')
	async logout(@AuthUser() userData) {
		return true;
	}

	@Post('resign')
	@UseGuards(JwtAuthGuard)
	@ApiDocs.deleteUser('회원탈퇴')
	async deleteUser(@AuthUser() userData, @Body() passwordReq: DeleteUserRequestDto) {
		return await this.authService.deleteUser(userData.id, passwordReq);
	}
}
