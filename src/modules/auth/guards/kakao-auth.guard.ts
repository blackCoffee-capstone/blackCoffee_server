import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { OauthUserDto } from '../dto/oauth-user.dto';

import { KakaoAuthStrategy } from '../strategies/kakao-auth.strategy';

@Injectable()
export class KakaoAuthGuard implements CanActivate {
	constructor(private readonly kakao: KakaoAuthStrategy) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const accessToken: string = <string>request.body.accessToken;
		if (!accessToken) throw new UnauthorizedException();

		const validateTokenResult: any = await this.kakao.ValidateTokenAndDecode(accessToken);
		if (!validateTokenResult.id) throw new UnauthorizedException();

		const kakaoAccount = validateTokenResult.kakao_account;
		const kakaoUser = new OauthUserDto({
			name: kakaoAccount.profile.nickname,
			socialId: validateTokenResult.id,
			email: kakaoAccount.has_email && !kakaoAccount.email_needs_agreement ? kakaoAccount.email : null,
		});
		request.body = { kakaoUser: kakaoUser };

		return true;
	}
}
