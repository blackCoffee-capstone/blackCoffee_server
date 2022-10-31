import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppConfig, DatabaseConfig } from '@src/config/config.constant';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
				const dbConfig = configService.get<DatabaseConfig>('databaseConfig');
				const appConfig = configService.get<AppConfig>('appConfig');

				return {
					type: 'postgres',
					host: dbConfig.host,
					port: dbConfig.port,
					username: dbConfig.username,
					password: dbConfig.password,
					database: dbConfig.dbname,
					namingStrategy: new SnakeNamingStrategy(),
					synchronize: appConfig.env !== 'prod',
					logging: appConfig.env !== 'prod',
					dropSchema: appConfig.env === 'test',
					autoLoadEntities: true,
				};
			},
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {}
