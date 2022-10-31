import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '@src/entities/users.entity';
import { MockUsersRepository } from 'server/test/mock/users.mock';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
	let usersController: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
			],
		}).compile();

		usersController = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(usersController).toBeDefined();
	});
});
