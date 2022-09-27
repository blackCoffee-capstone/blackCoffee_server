import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	public findAllUsers(): string {
		return 'test';
	}
}
