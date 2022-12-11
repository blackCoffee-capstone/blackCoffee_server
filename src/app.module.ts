import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { AdFormsModule } from './modules/ad-forms/ad-forms.module';
import { AdminsModule } from './modules/admins/admins.module';
import { AdsModule } from './modules/ads/ads.module';
import { AuthCodesModule } from './modules/auth-codes/auth-codes.module';
import { AuthModule } from './modules/auth/auth.module';
import { FiltersModule } from './modules/filters/filters.module';
import { LikesModule } from './modules/likes/likes.module';
import { PostsModule } from './modules/posts/posts.module';
import { RanksModule } from './modules/ranks/ranks.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { ReportPostsModule } from './modules/report-posts/report-posts.module';
import { SpotsModule } from './modules/spots/spots.module';
import { TasteThemesModule } from './modules/taste-themes/taste-themes.module';
import { UsersModule } from './modules/users/users.module';
import { WishesModule } from './modules/wishes/wishes.module';
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
		RanksModule,
		RecommendationsModule,
		PostsModule,
		AdminsModule,
		ReportPostsModule,
		WishesModule,
		LikesModule,
		AdsModule,
	],
	controllers: [AppController, ViewController],
	providers: [AppService],
})
export class AppModule {}
