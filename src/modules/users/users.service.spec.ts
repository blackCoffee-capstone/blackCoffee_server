import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from 'src/entities/users.entity';
import { MockUsersRepository } from 'test/mock/users.mock';
import { UsersService } from './users.service';

describe('UsersService', () => {
	let usersService: UsersService;
	let usersRepository: MockUsersRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
			],
		}).compile();

		usersService = module.get<UsersService>(UsersService);
		usersRepository = module.get(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(usersService).toBeDefined();
	});
});
