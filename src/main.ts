import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { AppConfig } from './config/config.constant';
import { setupSwagger } from './swagger';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const appConfig = app.get(ConfigService).get<AppConfig>('appConfig');
	const port = appConfig.listeningPort;

	setupSwagger(app);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: false,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.useStaticAssets(resolve('./src/public'));
	app.setBaseViewsDir(resolve('./src/views'));
	app.setViewEngine('hbs');

	await app.listen(port);
	console.log(`==================listening on port ${port}==================`);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
