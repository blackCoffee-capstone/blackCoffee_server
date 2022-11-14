import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthCodeType } from 'src/types/auth-code.types';
import { ApiDocs } from './auth-codes.docs';
import { AuthCodesService } from './auth-codes.service';
import { AuthCodeRequestDto } from './dto/auth-code-request.dto';
import { VerifyAuthCodeRequestDto } from './dto/verify-auth-code-request.dto';

@Controller('auth-codes')
@ApiTags('auth-codes')
export class AuthCodesController {
	constructor(private readonly authCodesService: AuthCodesService) {}

	@Post('/signup')
	@ApiDocs.generateSignUpAuthCode('회원가입을 위한 인증 메일 전송')
	async generateSignUpAuthCode(@Body() authCodeReq: AuthCodeRequestDto) {
		return await this.authCodesService.generateAuthCode(authCodeReq.email, AuthCodeType.SignUp);
	}

	@Post('/signup/verify')
	@ApiDocs.verifySignUpAuthCode('회원가입 인증 코드 확인')
	async verifySignUpAuthCode(@Body() authCode: VerifyAuthCodeRequestDto) {
		return await this.authCodesService.verifyAuthCode(authCode, AuthCodeType.SignUp);
	}

	@Post('/find-pw')
	async findUsersPw(@Body() authCodeReq: AuthCodeRequestDto) {
		return await this.authCodesService.generateAuthCode(authCodeReq.email, AuthCodeType.FindPw);
	}

	@Post('/find-pw/verify')
	async verifyFindPwAuthCode(@Body() authCode: VerifyAuthCodeRequestDto) {
		return await this.authCodesService.verifyAuthCode(authCode, AuthCodeType.FindPw);
	}
}
