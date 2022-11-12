import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('view')
export class ViewController {
	@Get('/admin/login')
	adminLogin(@Res() res: Response) {
		return res.render('admin-login');
	}

	@Get('/admin')
	@Render('admin-main')
	adminMain() {
		return {};
	}
}
