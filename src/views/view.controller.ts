import { Controller, Get, Render } from '@nestjs/common';

@Controller('view')
export class ViewController {
	@Get('/admin/login')
	@Render('admin-login')
	adminLogin() {
		return {};
	}

	@Get('/admin')
	@Render('admin-main')
	adminMain() {
		return {};
	}
}
