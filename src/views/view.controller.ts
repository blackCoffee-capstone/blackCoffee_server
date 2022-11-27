import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('admin')
export class ViewController {
	@Get('/login')
	adminLogin(@Res() res: Response) {
		return res.render('admin-login');
	}

	@Get()
	@Render('admin-main')
	adminMain() {
		return {};
	}

	@Get('/ad-request')
	adRequestn(@Res() res: Response) {
		return res.render('ad-request');
	}
}
