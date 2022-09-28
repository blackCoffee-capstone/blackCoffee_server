import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AuthController } from './auth.controller';
import { KakaoLoginRequestDto } from './dto/kakao-login-request.dto';

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
			}),
		);
	},
};
