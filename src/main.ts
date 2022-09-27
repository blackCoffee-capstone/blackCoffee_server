import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	//TODO:
	const port = 3000;

	const config = new DocumentBuilder()
		.setTitle('Test API')
		.setDescription('The test API description')
		.setVersion('1.0')
		.addTag('test')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(port);
	console.log(`==================listening on port ${port}==================`);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
