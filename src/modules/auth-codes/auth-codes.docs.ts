import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AuthCodesController } from './auth-codes.controller';
import { AuthCodeRequestDto } from './dto/auth-code-request.dto';
import { AuthCodeResponseDto } from './dto/auth-code-response.dto';
import { VerifyAuthCodeRequestDto } from './dto/verify-auth-code-request.dto';
import { VerifyAuthCodeResponseDto } from './dto/verify-auth-code-response.dto';

export const ApiDocs: SwaggerMethodDoc<AuthCodesController> = {
	generateSignUpAuthCode(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '회원가입을 위한 인증코드 메일 발송 또는 재발송',
			}),
			ApiBody({
				type: AuthCodeRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: AuthCodeResponseDto,
			}),
		);
	},
	verifySignUpAuthCode(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '회원가입을 위한 인증 코드 확인',
			}),
			ApiBody({
				type: VerifyAuthCodeRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: VerifyAuthCodeResponseDto,
			}),
		);
	},
	generateFindPwAuthCode(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '임시 비밀번호 발급을 위한 인증코드 메일 발송 또는 재발송',
			}),
			ApiBody({
				type: AuthCodeRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: AuthCodeResponseDto,
			}),
		);
	},
	verifyFindPwAuthCode(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '임시 비밀번호 발급을 위한 인증 코드 확인',
			}),
			ApiBody({
				type: VerifyAuthCodeRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: VerifyAuthCodeResponseDto,
			}),
		);
	},
};
