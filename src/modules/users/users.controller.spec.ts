import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Spot } from 'src/entities/spots.entity';
import { TasteSpot } from 'src/entities/taste-spots.entity';
import { User } from 'src/entities/users.entity';
import { MockSpotsRepository } from 'test/mock/spots.mock';
import { MockTasteSpotsRepository } from 'test/mock/taste-spots.mock';
import { MockUsersRepository } from 'test/mock/users.mock';
import { HashPassword } from '../auth/hash-password';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
	let usersController: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				UsersService,
				HashPassword,
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

		usersController = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(usersController).toBeDefined();
	});
});
