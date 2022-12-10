export const mockWishSpot = [
	{
		id: 1,
		userId: 1,
		name: 'test',
		address: '부산 해운대구',
		views: 1,
		wishes: 1,
		isWish: true,
		photoUrl: 'test',
	},
];

export class MockWishSpotsRepository {
	save = jest.fn();
	create = jest.fn();
	delete = jest.fn();
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
		save: jest.fn().mockReturnThis(),
		take: jest.fn().mockReturnThis(),
		skip: jest.fn().mockReturnThis(),
	});
	async find() {
		return mockWishSpot;
	}
}
