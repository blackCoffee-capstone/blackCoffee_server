import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { OauthConfig } from 'src/config/config.constant';

@Injectable()
export class FacebookAuthStrategy {
	constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}
	#oauthConfig = this.configService.get<OauthConfig>('oauthConfig').facebook;

	public async ValidateCode(code: string): Promise<any> {
		const accessTokenApiUrl = `https://graph.facebook.com/v2.11/oauth/access_token?client_id=${
			this.#oauthConfig.clientId
		}&redirect_uri=${this.#oauthConfig.callbackUrl}&client_secret=${this.#oauthConfig.secretKey}&code=${code}`;
		const codeRes = await firstValueFrom(this.httpService.get(accessTokenApiUrl));
		console.log(codeRes.data);
		const accessToken: string = codeRes.data.access_token;

		const validateApiUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${
			this.#oauthConfig.clientId
		}|${this.#oauthConfig.secretKey}`;
		const accessTokenRes = await firstValueFrom(this.httpService.get(validateApiUrl));
		console.log(accessTokenRes.data);
		const isValid: boolean = accessTokenRes.data.is_valid;

		if (!isValid) {
			throw new UnauthorizedException();
		}

		const userDataApiUrl = `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`;
		const userDataRes = await firstValueFrom(this.httpService.get(userDataApiUrl));
		console.log(userDataRes.data);
		const userData = userDataRes.data;

		return userData;
	}
}
