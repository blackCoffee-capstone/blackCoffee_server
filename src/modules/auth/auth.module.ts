import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoAuthStrategy } from './strategies/kakao-auth.strategy';

@Module({
	imports: [HttpModule, TypeOrmModule.forFeature([User])],
	controllers: [AuthController],
	providers: [AuthService, KakaoAuthStrategy],
})
export class AuthModule {}
