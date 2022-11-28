import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { OauthUserDto } from '../dto/oauth-user.dto';
import { FacebookAuthStrategy } from '../strategies/facebook-auth.strategy';

@Injectable()
export class FacebookAuthGuard implements CanActivate {
	constructor(private readonly facebook: FacebookAuthStrategy) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const code: string = <string>request.body.code;
		if (!code) throw new UnauthorizedException();

		//code -> accessToken
		const validateCodeResult: any = await this.facebook.ValidateCode(code);
		if (!validateCodeResult.id) throw new UnauthorizedException();

		const facebookUser = new OauthUserDto({
			name: validateCodeResult.name,
			socialId: validateCodeResult.id,
			email: validateCodeResult.email ? validateCodeResult.email : null,
		});
		request.body = { facebookUser: facebookUser };

		return true;
	}
}
