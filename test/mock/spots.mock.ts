export const mockSpot = {
	locationId: 1,
	id: 1,
	name: '수원 여행지',
	latitude: 37.253452,
	longitude: 126.234523,
	geom: '(37.253452, 126.234523)',
	rank: 1,
	snsPostCount: 50,
	snsPostLikeNumber: 252,
};

export class MockSpotsRepository {
	save = jest.fn().mockResolvedValue(mockSpot);
	createQueryBuilder = jest.fn().mockReturnValue({
		orderBy: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn().mockReturnThis(),
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
	});
	findOne = jest.fn().mockReturnThis();

	async find() {
		return mockSpot;
	}
}
