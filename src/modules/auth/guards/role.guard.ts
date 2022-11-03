import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const _matchRoles = (roles, userRoles) => {
	return roles.some((role) => role === userRoles);
};

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) {
			return true;
		}
		const req = context.switchToHttp().getRequest();
		const user = req.user;
		return _matchRoles(roles, user.role);
	}
}
