import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
	SWAGGER_API_CURRENT_VERSION,
	SWAGGER_API_DESCRIPTION,
	SWAGGER_API_ROOT,
	SWAGGER_API_TAG,
	SWAGGER_API_TITLE,
} from './constants';

export const setupSwagger = (app: INestApplication) => {
	const config = new DocumentBuilder()
		.setTitle(SWAGGER_API_TITLE)
		.setDescription(SWAGGER_API_DESCRIPTION)
		.setVersion(SWAGGER_API_CURRENT_VERSION)
		.addTag(SWAGGER_API_TAG)
		.addBearerAuth(
			{
				description: 'Enter token',
				name: 'Authorization',
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'bearer',
			},
			'Authorization',
		)
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(SWAGGER_API_ROOT, app, document, {
		swaggerOptions: {
			operationsSorter: 'method',
		},
	});
};
