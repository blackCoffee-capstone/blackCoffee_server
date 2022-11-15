import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { appConfig, databaseConfig, emailConfig, jwtConfig, ncloudConfig, oauthConfig } from './config.constant';
import { configValidationSchema } from './config.validation';

@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [`.env.${process.env.STAGE}`],
			load: [appConfig, databaseConfig, oauthConfig, jwtConfig, emailConfig, ncloudConfig],
			validationSchema: configValidationSchema,
		}),
	],
})
export class ConfigModule {}
