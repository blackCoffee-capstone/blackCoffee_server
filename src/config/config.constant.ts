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
	facebook: {
		clientId: string;
		secretKey: string;
		callbackUrl: string;
	};
};

export type JwtConfig = {
	jwtAccessTokenSecret: string;
	jwtAccessTokenExpire: string;
	jwtAccessTokenExpireAdmin: string;
	jwtRefreshTokenSecret: string;
	jwtRefreshTokenExpire: string;
};

export type EmailConfig = {
	email: string;
	emailPassword: string;
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
		facebook: {
			clientId: process.env.FACEBOOK_CLIENT_ID,
			secretKey: process.env.FACEBOOK_SECRET_KEY,
			callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
		},
	},
});

export const jwtConfig = (): { jwtConfig: JwtConfig } => ({
	jwtConfig: {
		jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
		jwtAccessTokenExpire: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
		jwtAccessTokenExpireAdmin: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME_ADMIN,
		jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
		jwtRefreshTokenExpire: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
	},
});

export const emailConfig = (): { emailConfig: EmailConfig } => ({
	emailConfig: {
		email: process.env.EMAIL,
		emailPassword: process.env.EMAIL_PASSWORD,
	},
});
