import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthCodesModule } from './modules/auth-codes/auth-codes.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ViewController } from './views/view.controller';

@Module({
	imports: [ConfigModule, UsersModule, DatabaseModule, AuthModule, MailerModule, AuthCodesModule],
	controllers: [AppController, ViewController],
	providers: [AppService],
})
export class AppModule {}
