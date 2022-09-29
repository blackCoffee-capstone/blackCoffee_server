import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
	imports: [ConfigModule, UsersModule, DatabaseModule, AuthModule, MailerModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
