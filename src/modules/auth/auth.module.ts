import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashPassword } from './hash-password';
import { FacebookAuthStrategy } from './strategies/facebook-auth.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KakaoAuthStrategy } from './strategies/kakao-auth.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [
		HttpModule,
		PassportModule,
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			secret: process.env.JWT_ACCESS_TOKEN_SECRET,
			signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		KakaoAuthStrategy,
		JwtStrategy,
		JwtRefreshStrategy,
		HashPassword,
		FacebookAuthStrategy,
		LocalStrategy,
	],
})
export class AuthModule {}
