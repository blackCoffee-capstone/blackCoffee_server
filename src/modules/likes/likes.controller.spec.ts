import { Post } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LikePost } from 'src/entities/like-posts.entity';
import { User } from 'src/entities/users.entity';
import { UserType } from 'src/types/users.types';
import { MockLikePostsRepository } from 'test/mock/like-posts.mock';
import { MockPostsRepository } from 'test/mock/posts.mock';
import { MockUsersRepository } from 'test/mock/users.mock';
import { UserLikesDto } from './dto/user-likes.dto';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

describe('LikesController', () => {
	let likesController: LikesController;
	let likePostsRepository: MockLikePostsRepository;
	let usersRepository: MockUsersRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LikesController],
			providers: [
				LikesService,
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
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

		likesController = module.get<LikesController>(LikesController);
		likePostsRepository = module.get(getRepositoryToken(LikePost));
		usersRepository = module.get(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(likesController).toBeDefined();
	});
	describe('getUsersLikes()', () => {
		it('사용자의 좋아요 목록을 반환한다.', async () => {
			const user = await usersRepository.find();
			const likePosts = await likePostsRepository.find();
			const expectLikePosts = likePosts.map((item) => new UserLikesDto(item));
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);
			likePostsRepository.createQueryBuilder().getMany.mockResolvedValue([
				{
					post: {
						id: 1,
						title: 'test',
						address: '부산 해운대구',
						createdAt: '2022-12-01',
						clickPosts: [1],
						likePosts: [1],
						photoUrls: 'test',
						location: { id: 1, metroName: '부산', localName: '해운대구' },
					},
				},
			]);

			await expect(
				likesController.getUsersLikes(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ page: 1, take: 10 },
				),
			).resolves.toEqual({
				totalPage: 1,
				totalLikePosts: 1,
				likePosts: expectLikePosts,
			});
		});
	});
});
