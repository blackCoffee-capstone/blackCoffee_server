import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from 'src/entities/locations.entity';
import { Post } from 'src/entities/posts.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockPostsRepository } from 'test/mock/posts.mock';
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
