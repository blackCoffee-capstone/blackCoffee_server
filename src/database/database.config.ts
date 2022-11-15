import * as dotenv from 'dotenv';
import { AdForm } from 'src/entities/ad-form.entity';
import { AuthCode } from 'src/entities/auth-code.entity';
import { Location } from 'src/entities/locations.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { TasteSpot } from 'src/entities/taste-spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { User } from 'src/entities/users.entity';
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
	entities: [User, AdForm, AuthCode, Theme, Location, Spot, SnsPost, TasteSpot],
	seeds: [
		seedUrl + 'users.seed.ts',
		seedUrl + 'themes.seed.ts',
		seedUrl + 'locations.seed.ts',
		seedUrl + 'spots.seed.ts',
		seedUrl + 'sns-posts.seed.ts',
	],
	namingStrategy: new SnakeNamingStrategy(),
	synchronize: process.env.NODE_ENV !== 'prod',
	logging: process.env.NODE_ENV !== 'prod',
	dropSchema: process.env.NODE_ENV === 'test',
};

export = config;
