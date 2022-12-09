export const mockPost = [
	{
		id: 1,
		title: 'test',
		address: '부산 해운대구',
		createdAt: '2022-12-01',
		views: 1,
		likes: 1,
		photoUrls: ['test1', 'test2'],
		isLike: true,
		user: { id: 1, nickname: 'test' },
		location: { id: 1, metroName: '부산', localName: '해운대구' },
	},
];

export class MockPostsRepository {
	save = jest.fn();
	createQueryBuilder = jest.fn().mockReturnValue({
		innerJoin: jest.fn().mockReturnThis(),
		leftJoin: jest.fn().mockReturnThis(),
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
		getRawOne: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
		getOne: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		execute: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn().mockReturnThis(),
	});
	async find() {
		return mockPost;
	}
}
