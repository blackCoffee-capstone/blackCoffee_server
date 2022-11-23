import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from 'src/entities/locations.entity';
import { Post } from 'src/entities/posts.entity';
import { MockLocationsRepository } from 'test/mock/locations.mock';
import { MockPostsRepository } from 'test/mock/posts.mock';
import { PostsService } from './posts.service';

describe('PostsService', () => {
	let service: PostsService;

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
					provide: HttpService,
					useValue: {
						//TODO:
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						post: jest.fn(() => {}),
					},
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'ncloudConfig' || key === 'oauthConfig') {
								return 1;
							}
							return null;
						}),
					},
				},
			],
		}).compile();

		service = module.get<PostsService>(PostsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
