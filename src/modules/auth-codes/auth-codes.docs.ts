import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { boolean } from 'joi';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { AuthCodesController } from './auth-codes.controller';
import { AuthCodeRequestDto } from './dto/auth-code-request.dto';
import { AuthCodeResponseDto } from './dto/auth-code-response.dto';
import { VerifyAuthCodeRequestDto } from './dto/verify-auth-code-request.dto';

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
	verifyAuthCode(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '회원가입 인증 코드 확인',
			}),
			ApiBody({
				type: VerifyAuthCodeRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: boolean,
			}),
		);
	},
};
