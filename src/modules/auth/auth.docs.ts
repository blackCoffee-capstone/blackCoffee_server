import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { boolean } from 'joi';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AuthController } from './auth.controller';
import { AuthCodeDto } from './dto/auth-code.dto';
import { KakaoLoginRequestDto } from './dto/kakao-login-request.dto';
import { KakaoLoginResponseDto } from './dto/kakao-login-response.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { TokenRefreshRequestDto } from './dto/token-refresh-request.dto';
import { TokenRefreshResponseDto } from './dto/token-refresh-response.dto';

export const ApiDocs: SwaggerMethodDoc<AuthController> = {
	getKakaoLoginPage(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '카카오 로그인 페이지로 리디렉트',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
		);
	},
	kakaoLoginCallback(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '카카오 로그인 redirect url',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
		);
	},
	kakaoLogin(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description:
					'카카오 서버 access token으로 사용자 정보를 가져와, 회원가입&로그인 후 사용자 정보와 토큰 반환',
			}),
			ApiBody({
				type: KakaoLoginRequestDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: KakaoLoginResponseDto,
			}),
		);
	},
	signUp(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '일반 회원가입',
			}),
			ApiBody({
				type: SignUpRequestDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: SignUpResponseDto,
			}),
		);
	},
	confirmAuthCode(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '인증 코드 확인',
			}),
			ApiBody({
				type: AuthCodeDto,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: boolean,
			}),
		);
	},
	refreshToken(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: 'access token이 만료된 경우 재발급',
			}),
			ApiBody({
				type: TokenRefreshRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: TokenRefreshResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
