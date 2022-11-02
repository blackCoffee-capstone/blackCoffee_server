import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ViewController } from './views/view.controller';
import { SpotsModule } from './modules/spots/spots.module';

@Module({
	imports: [ConfigModule, UsersModule, DatabaseModule, AuthModule, MailerModule, SpotsModule],
	controllers: [AppController, ViewController],
	providers: [AppService],
})
export class AppModule {}
