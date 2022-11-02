import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { OauthConfig } from 'src/config/config.constant';
import { OauthUserDto } from '../dto/oauth-user.dto';

@Injectable()
export class FacebookAuthStrategy extends PassportStrategy(Strategy, 'facebook') {
	constructor(private readonly configService: ConfigService) {
		const facebookAuthConfig = configService.get<OauthConfig>('oauthConfig').facebook;
		super({
			clientID: facebookAuthConfig.clientId,
			clientSecret: facebookAuthConfig.secretKey,
			callbackURL: facebookAuthConfig.callbackUrl,
			scope: 'email',
			profileFields: ['emails', 'name'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
		const user = {
			socialId: parseInt(profile.id),
			email: profile.emails ? profile.emails[0].value : null,
			name: profile.name.familyName + profile.name.givenName,
		};

		return new OauthUserDto(user);
	}
}
