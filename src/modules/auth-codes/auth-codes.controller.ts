import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
		return await this.authCodesService.generateSignUpAuthCode(authCodeReq.email);
	}

	@Post('/signup/verify')
	@ApiDocs.verifyAuthCode('회원가입 인증 코드 확인')
	async verifyAuthCode(@Body() authCode: VerifyAuthCodeRequestDto) {
		return await this.authCodesService.verifyAuthCode(authCode);
	}

	@Post('/find-pw')
	async findUsersPw(@Body() authCodeReq: AuthCodeRequestDto) {
		return await this.authCodesService.generateFindPwAuthCode(authCodeReq.email);
	}
}
