export const mockSpot = [
	{
		locationId: 1,
		id: 1,
		name: '수원 여행지',
		latitude: 37.253452,
		longitude: 126.234523,
		geom: '(37.253452, 126.234523)',
		rank: 1,
		snsPostCount: 50,
		snsPostLikeNumber: 252,
	},
];

export class MockSpotsRepository {
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
	findOne = jest.fn().mockReturnThis();

	async find() {
		return mockSpot;
	}
}
