import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
	imports: [ConfigModule, UsersModule, DatabaseModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
