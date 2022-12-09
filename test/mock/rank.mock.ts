export const mockRank = [
	{
		id: 1,
		name: 'test',
		address: 'testAddress',
		current_rank: 1,
		after_rank: 1,
		variance: null,
		clicks: 1,
		wishes: 1,
		photo: 'testUrl',
		latitude: 36.6666,
		longitude: 126.5555,
	},
	{
		id: 2,
		name: 'test2',
		address: 'testAddress2',
		current_rank: 2,
		after_rank: 2,
		variance: null,
		clicks: 1,
		wishes: 1,
		photo: 'testUrl2',
		latitude: 36.6666,
		longitude: 126.5555,
	},
];

export class MockRankRepository {
	save = jest.fn();
	update = jest.fn();
	createQueryBuilder = jest.fn().mockReturnValue({
		innerJoinAndSelect: jest.fn().mockReturnThis(),
		distinctOn: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		addSelect: jest.fn().mockReturnThis(),
		getOne: jest.fn().mockReturnThis(),
	});

	async find() {
		return mockRank;
	}
}
