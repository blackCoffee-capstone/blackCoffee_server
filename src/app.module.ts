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
import { RanksModule } from './modules/ranks/ranks.module';
import { SpotsModule } from './modules/spots/spots.module';
import { TasteSpotsModule } from './modules/taste-spots/taste-spots.module';
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
		TasteSpotsModule,
		FiltersModule,
		RanksModule,
	],
	controllers: [AppController, ViewController],
	providers: [AppService],
})
export class AppModule {}
