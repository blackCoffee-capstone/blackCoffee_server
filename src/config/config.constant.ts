import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.STAGE}` });

export type NodeEnv = 'dev' | 'integ' | 'test' | 'prod';

export type AppConfig = {
	env: NodeEnv;
	listeningPort: number;
	cors: {
		origin: string[] | true;
	};
};

export type DatabaseConfig = {
	username: string;
	password: string;
	host: string;
	port: number;
	dbname: string;
};

export type OauthConfig = {
	kakao: {
		clientId: string;
		callbackUrl: string;
	};
};

export const appConfig = (): { appConfig: AppConfig } => ({
	appConfig: {
		env: process.env.NODE_ENV as NodeEnv,
		listeningPort: +process.env.PORT || 3000,
		cors: {
			origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
		},
	},
});

export const databaseConfig = (): { databaseConfig: DatabaseConfig } => ({
	databaseConfig: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		host: process.env.DATABASE_HOST,
		port: +process.env.DATABASE_PORT,
		dbname: process.env.DATABASE_DB,
	},
});

export const oauthConfig = (): { oauthConfig: OauthConfig } => ({
	oauthConfig: {
		kakao: {
			clientId: process.env.KAKAO_CLIENT_ID,
			callbackUrl: process.env.KAKAO_CALLBACK_URL,
		},
	},
});
