import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
	handleRequest(err: any, user: any, info: Error, context: any, status: any) {
		if (info instanceof TokenExpiredError) {
			throw new UnauthorizedException('token expired');
		}
		return super.handleRequest(err, user, info, context, status);
	}
}
