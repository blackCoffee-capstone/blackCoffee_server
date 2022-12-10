export const mockPost = [
	{
		id: 1,
		title: 'test',
		content: 'testContent',
		userid: 1,
		name: 'test',
		address: '부산 해운대구',
		create: '2022-12-01',
		views: 1,
		likes: 1,
		photos: ['test1', 'test2'],
		photoUrls: ['test1', 'test2'],
		isWriter: true,
		createdAt: '2022-12-06 23:07:57.787562+09',
		location: { id: 1, metroName: '부산', localName: '해운대구' },
		isLike: true,
		likeUsers: true,
		order: 1,
		user: { id: 1, nickname: 'test' },
		themes: [
			{
				postId: 1,
				themeid: 1,
			},
		],
		clickPosts: [
			{
				id: 1,
				userId: 1,
				postId: 1,
			},
		],
		likePosts: [
			{
				id: 1,
				userId: 1,
				postId: 1,
			},
		],
	},
];

export class MockPostsRepository {
	save = jest.fn();
	update = jest.fn();
	createQueryBuilder = jest.fn().mockReturnValue({
		innerJoin: jest.fn().mockReturnThis(),
		leftJoin: jest.fn().mockReturnThis(),
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		addSelect: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
		getRawOne: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
		getOne: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		execute: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn().mockReturnThis(),
		distinct: jest.fn().mockReturnThis(),
	});
	async find() {
		return mockPost;
	}
}
