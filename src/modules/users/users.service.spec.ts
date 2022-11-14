import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Spot } from 'src/entities/spots.entity';
import { TasteSpot } from 'src/entities/taste-spots.entity';
import { User } from 'src/entities/users.entity';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockTasteSpotsRepository } from 'test/mock/taste-spots.mock';
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
				{
					provide: getRepositoryToken(TasteSpot),
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
