import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		NestMailerModule.forRoot({
			transport: {
				service: 'gmail',
				host: 'smtp.gmail.com',
				auth: {
					user: process.env.EMAIL,
					pass: process.env.EMAIL_PASSWORD,
				},
			},
			defaults: {
				from: `"지금,여기" <${process.env.EMAIL}>`,
			},
		}),
	],
})
export class MailerModule {}
