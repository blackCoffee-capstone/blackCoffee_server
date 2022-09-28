import { Body, Controller, Get, Header, HttpCode, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserResponseDto } from '../users/dto/user-response.dto';
import { ApiDocs } from './auth.docs';
import { AuthService } from './auth.service';
import { KakaoUserDto } from './dto/kakao-user.dto';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	//Test
	@Get('/kakao-login1')
	@Header('Content-Type', 'text/html')
	@Redirect()
	@ApiDocs.getKakaoLoginPage('카카오 로그인 페이지로 리디렉트')
	getKakaoLoginPage() {
		const kakaoCallbackUrl: string = this.authService.getKakaoLoginPage();
		return {
			url: kakaoCallbackUrl,
		};
	}

	//Test
	@Get('/kakao-callback')
	@HttpCode(200)
	@ApiDocs.kakaoLoginCallback('카카오 로그인 redirect url')
	async kakaoLoginCallback(@Query('code') code: string) {
		return await this.authService.test(code);
	}

	@UseGuards(KakaoAuthGuard)
	@Post('/kakao-login')
	@HttpCode(200)
	@ApiDocs.kakaoLogin('카카오 로그인 회원가입&로그인 후 유저 정보, 토큰 반환')
	async kakaoLogin(@Body('kakaoUser') kakaoUser) {
		const user: UserResponseDto = await this.authService.createKakaoUser(kakaoUser as KakaoUserDto);
		return user;
	}
}
