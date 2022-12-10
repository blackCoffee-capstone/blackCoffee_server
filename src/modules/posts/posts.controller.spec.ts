import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdForm } from 'src/entities/ad-form.entity';
import { ClickPost } from 'src/entities/click-posts.entity';
import { LikePost } from 'src/entities/like-posts.entity';
import { Location } from 'src/entities/locations.entity';
import { PostComment } from 'src/entities/post-comments.entity';
import { PostTheme } from 'src/entities/post-themes.entity';
import { Post } from 'src/entities/posts.entity';
import { ReportPost } from 'src/entities/report-posts.entity';
import { Theme } from 'src/entities/theme.entity';
import { PostsSortType } from 'src/types/posts-sort.types';
import { UserType } from 'src/types/users.types';
import { MockAdFormsRepository } from 'test/mock/ad-forms.mock';
import { MockClickPostsRepository } from 'test/mock/click-posts.mock';
import { MockLikePostsRepository } from 'test/mock/like-posts.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockPostCommentsRepository } from 'test/mock/post-comments.mock';
import { MockPostsRepository } from 'test/mock/posts.mock';
import { MockPostThemesRepository } from 'test/mock/postThemes.mock';
import { MockReportPostsRepository } from 'test/mock/report-posts.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { AdFormsService } from '../ad-forms/ad-forms.service';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { CommentsUserResponseDto } from '../users/dto/comments-user-response.dto';
import { GetPostsCommentsResponseDto } from './dto/get-posts-comments-response.dto';
import { GetPostsResponseDto } from './dto/get-posts-response.dto';
import { MainPostsResponseDto } from './dto/main-posts-response.dto';
import { PostCommentsResponseDto } from './dto/post-comments-response.dto';
import { ReportPostsResponseDto } from './dto/report-posts-response.dto';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
	let postsController: PostsController;
	let postsRepository: MockPostsRepository;
	let themesRepository: MockThemeRepository;
	let postThemesRepository: MockPostThemesRepository;
	let clickPostsRepository: MockClickPostsRepository;
	let postCommentsRepository: MockPostCommentsRepository;
	let reportPostsRepository: MockReportPostsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PostsController],
			providers: [
				PostsService,
				AdFormsService,
				{
					provide: getRepositoryToken(Location),
					useClass: MockLocationsRepository,
				},
				{
					provide: getRepositoryToken(Post),
					useClass: MockPostsRepository,
				},
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
				{
					provide: getRepositoryToken(PostTheme),
					useClass: MockPostThemesRepository,
				},
				{
					provide: getRepositoryToken(PostComment),
					useClass: MockPostCommentsRepository,
				},
				{
					provide: getRepositoryToken(ClickPost),
					useClass: MockClickPostsRepository,
				},
				{
					provide: getRepositoryToken(LikePost),
					useClass: MockLikePostsRepository,
				},
				{
					provide: getRepositoryToken(AdForm),
					useClass: MockAdFormsRepository,
				},
				{
					provide: getRepositoryToken(ReportPost),
					useClass: MockReportPostsRepository,
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'ncloudConfig') {
								return 1;
							}
							return null;
						}),
					},
				},
			],
		}).compile();

		postsController = module.get<PostsController>(PostsController);
		postsRepository = module.get(getRepositoryToken(Post));
		themesRepository = module.get(getRepositoryToken(Theme));
		postThemesRepository = module.get(getRepositoryToken(PostTheme));
		clickPostsRepository = module.get(getRepositoryToken(ClickPost));
		postCommentsRepository = module.get(getRepositoryToken(PostComment));
		reportPostsRepository = module.get(getRepositoryToken(ReportPost));
	});

	it('should be defined', () => {
		expect(postsController).toBeDefined();
	});
	describe('createPost()', () => {
		it('게시글 포스팅 사진이 없으면 BadRequestException error를 throw한다.', async () => {
			await expect(
				postsController.createPost(
					{
						id: 1,
						role: UserType.Normal,
					},
					null,
					{
						title: 'test',
						content: 'test',
						address: 'testAddress',
						themes: [1, 2, 3],
					},
				),
			).rejects.toThrow(BadRequestException);
		});
	});
	describe('getMainPost()', () => {
		it('필터링 / 정렬 / 검색 포스트 정보를 반환한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getRawMany.mockResolvedValue(posts);
			const expectPosts = posts.map(
				(post) =>
					new MainPostsResponseDto({
						...post,
						createdAt: post.create,
						photoUrls: post.photos,
						views: post.views,
						user: new CommentsUserResponseDto({ id: post.userid, nickname: post.name }),
						isLike: post.likeUsers,
					}),
			);

			await expect(
				postsController.getMainPost(
					{
						id: 1,
						role: UserType.Normal,
					},
					{
						page: 1,
						take: 20,
						sorter: PostsSortType.CreatedAt,
						word: 'test',
						locationIds: [1, 2, 3],
						themeIds: [1, 2, 3],
					},
				),
			).resolves.toEqual({ totalPage: 1, posts: expectPosts });
		});
	});
	describe('updatePost()', () => {
		it('post를 찾을 수 없으면 NotFoundException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			await expect(
				postsController.updatePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					3,
					null,
					{
						title: 'test',
						content: 'test',
						address: 'testAddress',
						themes: [1, 2, 3],
					},
				),
			).rejects.toThrow(NotFoundException);
		});
		it('사용자가 작성자가 아니면 UnauthorizedException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);

			await expect(
				postsController.updatePost(
					{
						id: 2,
						role: UserType.Normal,
					},
					1,
					null,
					{
						title: 'test',
						content: 'test',
						address: 'testAddress',
						themes: [1, 2, 3],
					},
				),
			).rejects.toThrow(UnauthorizedException);
		});
		it('테마 요청 리스트가 중복되면 BadRequestException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			await expect(
				postsController.updatePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
					null,
					{
						title: 'test',
						content: 'test',
						address: 'testAddress',
						themes: [1, 2, 2],
					},
				),
			).rejects.toThrow(BadRequestException);
		});
		it('테마를 찾을 수 없다면 NotFoundException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			const themesAll = await themesRepository.find();
			themesRepository.createQueryBuilder().getMany.mockResolvedValue(themesAll);

			await expect(
				postsController.updatePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
					null,
					{
						title: 'test',
						content: 'test',
						address: 'testAddress',
						themes: [1, 2, 7],
					},
				),
			).rejects.toThrow(NotFoundException);
		});
		it('포스트의 내용을 수정한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			const themesAll = await themesRepository.find();
			themesRepository.createQueryBuilder().getMany.mockResolvedValue(themesAll);

			await postThemesRepository.find();
			postThemesRepository.createQueryBuilder().execute.mockResolvedValue();
			postsRepository.update.mockResolvedValue(posts[0].id);

			await expect(
				postsController.updatePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
					null,
					{
						title: 'test',
						content: 'test',
						address: 'testAddress',
						themes: [1, 2, 3, 4, 5],
					},
				),
			).resolves.toEqual({ id: posts[0].id });
		});
	});
	describe('getPost()', () => {
		it('게시글 상세 페이지가 없으면 NotFoundException error를 throw한다.', async () => {
			await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue();
			await expect(
				postsController.getPost(
					{
						id: 1,
						role: UserType.Normal,
					},
					3,
				),
			).rejects.toThrow(NotFoundException);
		});
		it('게시글 상세 페이지를 반환한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);

			await clickPostsRepository.create;
			await clickPostsRepository.save;

			const themes = await postThemesRepository.find();
			postThemesRepository.createQueryBuilder().getRawMany.mockResolvedValue(themes);

			const post = new GetPostsResponseDto({
				...posts[0],
				views: posts[0].views + 1,
				location: new LocationResponseDto(posts[0].location),
				user: new CommentsUserResponseDto(posts[0].user),
			});

			await expect(
				postsController.getPost(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
				),
			).resolves.toEqual(post);
		});
	});
	describe('deletePost()', () => {
		it('게시글 상세 페이지가 없으면 NotFoundException error를 throw한다.', async () => {
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			await expect(
				postsController.deletePost(
					{
						id: 1,
						role: UserType.Normal,
					},
					3,
				),
			).rejects.toThrow(NotFoundException);
		});
		it('본인의 게시글이 아니라면 UnauthorizedException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			await expect(
				postsController.deletePost(
					{
						id: 2,
						role: UserType.Normal,
					},
					1,
				),
			).rejects.toThrow(UnauthorizedException);
		});
	});
	describe('createPostsComments()', () => {
		it('게시글 상세 페이지가 없으면 NotFoundException error를 throw한다.', async () => {
			await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue();
			await expect(
				postsController.createPostsComments(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
					{ content: 'test' },
				),
			).rejects.toThrow(NotFoundException);
		});
		it('게시글에 댓글을 작성한다.', async () => {
			const posts = await postsRepository.find();
			const postComment = await postCommentsRepository.findIsWriter();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			postCommentsRepository.create.mockResolvedValue(postComment);
			postCommentsRepository.save.mockResolvedValue(postComment);

			await expect(
				postsController.createPostsComments(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
					{ content: 'test' },
				),
			).resolves.toEqual(new PostCommentsResponseDto(postComment));
		});
	});
	describe('getPostsComments()', () => {
		it('게시글 상세 페이지가 없으면 NotFoundException error를 throw한다.', async () => {
			await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue();
			await expect(
				postsController.getPostsComments(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
				),
			).rejects.toThrow(NotFoundException);
		});
		it('게시글 댓글 목록을 반환한다.', async () => {
			const posts = await postsRepository.find();
			const postcomment = await postCommentsRepository.findIsWriter();
			const postComments = [postcomment];

			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			postCommentsRepository.createQueryBuilder().getRawMany.mockResolvedValue(postComments);

			await expect(
				postsController.getPostsComments(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
				),
			).resolves.toEqual(
				postComments.map(
					(comment) =>
						new GetPostsCommentsResponseDto({
							...comment,
							isWriter: true,
							user: new CommentsUserResponseDto({
								id: comment.user_id,
								nickname: comment.nickname,
							}),
						}),
				),
			);
		});
	});
	describe('deletePostsComment()', () => {
		it('게시글 상세 페이지가 없으면 NotFoundException error를 throw한다.', async () => {
			await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue();
			await expect(
				postsController.deletePostsComment(
					{
						id: 1,
						role: UserType.Normal,
					},
					3,
					1,
				),
			).rejects.toThrow(NotFoundException);
		});
		it('댓글이 없으면 NotFoundException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			const postcomment = await postCommentsRepository.findIsWriter();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			postCommentsRepository.createQueryBuilder().getRawOne.mockResolvedValue(null);
			await expect(
				postsController.deletePostsComment(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
					3,
				),
			).rejects.toThrow(NotFoundException);
		});
		it('작성자가 아니라면 UnauthorizedException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			const postcomment = await postCommentsRepository.findIsWriter();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			postCommentsRepository.createQueryBuilder().getRawOne.mockResolvedValue(postcomment);
			await expect(
				postsController.deletePostsComment(
					{
						id: 2,
						role: UserType.Normal,
					},
					1,
					1,
				),
			).rejects.toThrow(UnauthorizedException);
		});
		it('게시글 댓글을 삭제한다.', async () => {
			const posts = await postsRepository.find();
			const postcomment = await postCommentsRepository.findIsWriter();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			postCommentsRepository.createQueryBuilder().getRawOne.mockResolvedValue(postcomment);
			await expect(
				postsController.deletePostsComment(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
					1,
				),
			).resolves.toEqual(true);
		});
	});
	describe('reportPost()', () => {
		it('게시글 상세 페이지가 없으면 NotFoundException error를 throw한다.', async () => {
			await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue();
			await expect(
				postsController.reportPost(
					{
						id: 2,
						role: UserType.Normal,
					},
					1,
					{
						reason: 'test',
					},
				),
			).rejects.toThrow(NotFoundException);
		});
		it('사용자가 작성자라면 BadRequestException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			await expect(
				postsController.reportPost(
					{
						id: 1,
						role: UserType.Normal,
					},
					1,
					{
						reason: 'test',
					},
				),
			).rejects.toThrow(BadRequestException);
		});
		it('사용자가 이미 신고했다면 BadRequestException error를 throw한다.', async () => {
			const posts = await postsRepository.find();
			const reportPosts = await reportPostsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			reportPostsRepository.createQueryBuilder().getOne.mockResolvedValue(reportPosts[0]);

			await expect(
				postsController.reportPost(
					{
						id: 2,
						role: UserType.Normal,
					},
					1,
					{
						reason: 'test',
					},
				),
			).rejects.toThrow(BadRequestException);
		});
		it('게시글을 신고한다.', async () => {
			const posts = await postsRepository.find();
			const reportPosts = await reportPostsRepository.find();
			postsRepository.createQueryBuilder().getOne.mockResolvedValue(posts[0]);
			reportPostsRepository.createQueryBuilder().getOne.mockResolvedValue(null);
			reportPostsRepository.create.mockResolvedValue(reportPosts[0]);
			reportPostsRepository.save.mockResolvedValue(reportPosts[0]);

			await expect(
				postsController.reportPost(
					{
						id: 2,
						role: UserType.Normal,
					},
					1,
					{
						reason: 'test',
					},
				),
			).resolves.toEqual(new ReportPostsResponseDto({ id: reportPosts[0].id }));
		});
	});
});
