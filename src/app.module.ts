import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { AdFormsModule } from './modules/ad-forms/ad-forms.module';
import { AuthCodesModule } from './modules/auth-codes/auth-codes.module';
import { AuthModule } from './modules/auth/auth.module';
import { FiltersModule } from './modules/filters/filters.module';
import { SpotsModule } from './modules/spots/spots.module';
import { TasteThemesModule } from './modules/taste-themes/taste-themes.module';
import { UsersModule } from './modules/users/users.module';
import { ViewController } from './views/view.controller';

@Module({
	imports: [
		ConfigModule,
		UsersModule,
		DatabaseModule,
		AuthModule,
		MailerModule,
		AuthCodesModule,
		SpotsModule,
		AdFormsModule,
		TasteThemesModule,
		FiltersModule,
	],
	controllers: [AppController, ViewController],
	providers: [AppService],
})
export class AppModule {}
