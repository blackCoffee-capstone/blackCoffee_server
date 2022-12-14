import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('admin')
export class ViewController {
	@Get('/login')
	adminLogin(@Res() res: Response) {
		return res.render('admin-login');
	}

	@Get()
	adminMain(@Res() res: Response) {
		return res.render('admin-main');
	}

	@Get('/forbidden')
	forbidden(@Res() res: Response) {
		return res.render('forbidden');
	}

	@Get('/ad-request')
	adRequestn(@Res() res: Response) {
		return res.render('ad-request');
	}

	@Get('/ad')
	ad(@Res() res: Response) {
		return res.render('ad');
	}

	@Get('/posts/report')
	postsReport(@Res() res: Response) {
		return res.render('posts-report');
	}

	@Get('/posts/detail')
	postsDetail(@Res() res: Response) {
		return res.render('community-posts');
	}
}
