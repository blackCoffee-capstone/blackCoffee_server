import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LikePost } from 'src/entities/like-posts.entity';
import { Post } from 'src/entities/posts.entity';
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
	let postsRepository: MockPostsRepository;

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
		postsRepository = module.get(getRepositoryToken(Post));
	});

	it('should be defined', () => {
		expect(likesController).toBeDefined();
	});
	describe('likePost()', () => {
		it('커뮤니티 게시글 좋아요 등록을 한다.', async () => {
			const post = await postsRepository.find();
			const likePosts = await likePostsRepository.find()[0];
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(post);
			likePostsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			likePostsRepository.create.mockResolvedValue(likePosts);
			likePostsRepository.createQueryBuilder().save.mockResolvedValue(likePosts);

			await expect(
				likesController.likePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ postId: 1, isLike: true },
				),
			).resolves.toEqual(true);
		});
		it('커뮤니티 게시글 좋아요 취소를 한다.', async () => {
			const post = await postsRepository.find();
			const likePosts = await likePostsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(post);
			likePostsRepository.createQueryBuilder().getOne.mockResolvedValue(likePosts);
			likePostsRepository.create.mockResolvedValue(likePosts);
			likePostsRepository.delete.mockResolvedValue(true);
			likePostsRepository.createQueryBuilder().save.mockResolvedValue(likePosts);

			await expect(
				likesController.likePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ postId: 1, isLike: false },
				),
			).resolves.toEqual(true);
		});
		it('커뮤니티 게시글이 없다면 NotFoundException 에러를 반환한다.', async () => {
			const likePosts = await likePostsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			likePostsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			likePostsRepository.create.mockResolvedValue(likePosts);
			likePostsRepository.createQueryBuilder().save.mockResolvedValue(likePosts);

			await expect(
				likesController.likePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ postId: 1, isLike: true },
				),
			).rejects.toThrow(NotFoundException);
		});
		it('이미 좋아요를 했다면 BadRequestException 에러를 반환한다.', async () => {
			const post = await postsRepository.find();
			const likePosts = await likePostsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(post);
			likePostsRepository.createQueryBuilder().getOne.mockResolvedValue(likePosts);
			likePostsRepository.create.mockResolvedValue(likePosts);
			likePostsRepository.createQueryBuilder().save.mockResolvedValue(likePosts);

			await expect(
				likesController.likePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ postId: 1, isLike: true },
				),
			).rejects.toThrow(BadRequestException);
		});
		it('이미 좋아요를 하지 않았다면 BadRequestException 에러를 반환한다.', async () => {
			const post = await postsRepository.find();
			const likePosts = await likePostsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(post);
			likePostsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			likePostsRepository.create.mockResolvedValue(likePosts);
			likePostsRepository.createQueryBuilder().save.mockResolvedValue(likePosts);

			await expect(
				likesController.likePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ postId: 1, isLike: false },
				),
			).rejects.toThrow(BadRequestException);
		});
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
