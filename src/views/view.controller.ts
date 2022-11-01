import { Controller, Get, Render } from '@nestjs/common';

@Controller('view')
export class ViewController {
	@Get('/admin')
	@Render('admin-login')
	root() {
		return {};
	}
}
