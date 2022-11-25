import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClickPost } from 'src/entities/click-posts.entity';
import { LikePost } from 'src/entities/like-posts.entity';
import { Location } from 'src/entities/locations.entity';
import { PostComment } from 'src/entities/post-comments.entity';
import { PostTheme } from 'src/entities/post-themes.entity';
import { Post } from 'src/entities/posts.entity';
import { Theme } from 'src/entities/theme.entity';
import { MockClickPostsRepository } from 'test/mock/click-posts.mock';
import { MockLikePostsRepository } from 'test/mock/like-posts.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockPostCommentsRepository } from 'test/mock/post-comments.mock';
import { MockPostsRepository } from 'test/mock/posts.mock';
import { MockPostThemesRepository } from 'test/mock/postThemes.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { PostsService } from './posts.service';

describe('PostsService', () => {
	let postsService: PostsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PostsService,
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

		postsService = module.get<PostsService>(PostsService);
	});

	it('should be defined', () => {
		expect(postsService).toBeDefined();
	});
});
