import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from 'src/entities/auth-code.entity';
import { User } from 'src/entities/users.entity';
import { AuthCodesController } from './auth-codes.controller';
import { AuthCodesService } from './auth-codes.service';

@Module({
	imports: [TypeOrmModule.forFeature([AuthCode, User])],
	controllers: [AuthCodesController],
	providers: [AuthCodesService],
})
export class AuthCodesModule {}
