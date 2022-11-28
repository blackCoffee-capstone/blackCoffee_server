import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LikePost } from 'src/entities/like-posts.entity';
import { Post } from 'src/entities/posts.entity';

import { TasteTheme } from 'src/entities/taste-themes.entity';
import { Theme } from 'src/entities/theme.entity';
import { User } from 'src/entities/users.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { MockLikePostsRepository } from 'test/mock/like-posts.mock';
import { MockPostsRepository } from 'test/mock/posts.mock';
import { MockTasteThemesRepository } from 'test/mock/taste-themes.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { MockUsersRepository } from 'test/mock/users.mock';
import { MockWishSpotsRepository } from 'test/mock/wish-spots.mock';
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
					useClass: MockTasteThemesRepository,
				},
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
				{
					provide: getRepositoryToken(WishSpot),
					useClass: MockWishSpotsRepository,
				},
				{
					provide: getRepositoryToken(LikePost),
					useClass: MockLikePostsRepository,
				},
				{
					provide: getRepositoryToken(Post),
					useClass: MockPostsRepository,
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
