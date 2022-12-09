import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtConfig } from 'src/config/config.constant';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
		const jwtConfig = configService.get<JwtConfig>('jwtConfig');
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			IgnoreExpiration: false,
			secretOrKey: jwtConfig.jwtAccessTokenSecret,
		});
	}

	async validate(payload: any) {
		await this.authService.getUserIdIfExist(payload.id, payload.role);
		return { id: payload.id, role: payload.role };
	}
}
