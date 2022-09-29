import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from 'src/entities/auth-code.entity';

import { User } from 'src/entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KakaoAuthStrategy } from './strategies/kakao-auth.strategy';

@Module({
	imports: [
		HttpModule,
		TypeOrmModule.forFeature([User, AuthCode]),
		JwtModule.register({
			secret: process.env.JWT_ACCESS_TOKEN_SECRET,
			signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, KakaoAuthStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
