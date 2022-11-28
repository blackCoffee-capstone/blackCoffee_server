import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { databaseConfig } from '../config/config.constant';

const dbConfig = databaseConfig().databaseConfig;
const seedUrl = 'src/database/seeds/';
dotenv.config();
const config = {
	type: 'postgres',
	host: dbConfig.host,
	port: dbConfig.port,
	username: dbConfig.username,
	password: dbConfig.password,
	database: dbConfig.dbname,
	entities: ['src/entities/*.entity.ts'],
	seeds: [seedUrl + 'users.seed.ts', seedUrl + 'themes.seed.ts', seedUrl + 'locations.seed.ts'],
	namingStrategy: new SnakeNamingStrategy(),
	synchronize: process.env.NODE_ENV !== 'prod',
	logging: process.env.NODE_ENV !== 'prod',
	dropSchema: process.env.NODE_ENV === 'test',
};

export = config;
