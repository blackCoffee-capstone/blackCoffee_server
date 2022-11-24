import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClickPost } from 'src/entities/click-posts.entity';
import { Location } from 'src/entities/locations.entity';
import { PostComment } from 'src/entities/post-comments.entity';
import { PostTheme } from 'src/entities/post-themes.entity';
import { Post } from 'src/entities/posts.entity';
import { Theme } from 'src/entities/theme.entity';
import { MockClickPostsRepository } from 'test/mock/click-posts.mock';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockPostCommentsRepository } from 'test/mock/post-comments.mock';
import { MockPostsRepository } from 'test/mock/posts.mock';
import { MockPostThemesRepository } from 'test/mock/postThemes.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
	let controller: PostsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PostsController],
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

		controller = module.get<PostsController>(PostsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
