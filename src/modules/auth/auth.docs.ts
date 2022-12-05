import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AuthCodeRequestDto } from '../auth-codes/dto/auth-code-request.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthController } from './auth.controller';
import { DeleteUserRequestDto } from './dto/delete-user-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { TokenRefreshRequestDto } from './dto/token-refresh-request.dto';
import { TokenRefreshResponseDto } from './dto/token-refresh-response.dto';

export const ApiDocs: SwaggerMethodDoc<AuthController> = {
	kakaoLogin(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '카카오 서버 code로 사용자 정보를 가져와, 회원가입&로그인 후 사용자 정보와 토큰 반환',
			}),
			ApiQuery({
				name: 'code',
				required: true,
				description: '카카오 서버로부터 받은 code',
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: LoginResponseDto,
			}),
		);
	},
	getFacebookLoginPage(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '페이스북 로그인 페이지로 리디렉트',
			}),
			ApiResponse({
				status: 200,
				description: '',
			}),
		);
	},
	facebookLogin2(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '페이스북 서버에서 사용자 정보를 가져와, 회원가입&로그인 후 사용자 정보와 토큰 반환',
			}),
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						code: {
							description: '페이스북 로그인 code',
						},
					},
				},
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: LoginResponseDto,
			}),
		);
	},
	facebookLogin(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '페이스북 서버에서 사용자 정보를 가져와, 회원가입&로그인 후 사용자 정보와 토큰 반환',
			}),
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						code: {
							description: '페이스북 로그인 code',
						},
					},
				},
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: LoginResponseDto,
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
				status: 201,
				description: '',
				type: UserResponseDto,
			}),
		);
	},
	login(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '일반 로그인',
			}),
			ApiBody({
				type: LoginRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: LoginResponseDto,
			}),
		);
	},
	adminLogin(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '관리자 로그인',
			}),
			ApiBody({
				type: LoginRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: LoginResponseDto,
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
	generateTempPw(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '임시 비밀번호 메일로 발송',
			}),
			ApiBody({
				type: AuthCodeRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
		);
	},
	logout(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '로그아웃',
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
		);
	},
	deleteUser(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '회원탈퇴',
			}),
			ApiBody({
				type: DeleteUserRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
		);
	},
};
