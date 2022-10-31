import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtConfig } from '@src/config/config.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly configService: ConfigService) {
		const jwtConfig = configService.get<JwtConfig>('jwtConfig');
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			IgnoreExpiration: false,
			secretOrKey: jwtConfig.jwtAccessTokenSecret,
		});
	}

	async validate(payload: any) {
		return { id: payload.id };
	}
}
