import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { User } from 'src/entities/users.entity';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockTasteSpotsRepository } from 'test/mock/taste-spots.mock';
import { MockUsersRepository } from 'test/mock/users.mock';
import { HashPassword } from '../auth/hash-password';
import { UsersService } from './users.service';

describe('UsersService', () => {
	let usersService: UsersService;
	let usersRepository: MockUsersRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				HashPassword,
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
				{
					provide: getRepositoryToken(TasteTheme),
					useClass: MockTasteSpotsRepository,
				},
				{
					provide: getRepositoryToken(Spot),
					useClass: MockSpotsRepository,
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
