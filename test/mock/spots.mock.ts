export const mockSpot = [
	{
		id: 1,
		name: 'test',
		latitude: 37.253452,
		longitude: 126.234523,
		geom: '(37.253452, 126.234523)',
		address: '인천 연수구 컨벤시아대로',
		rank: 1,
		snsPostCount: 50,
		snsPostLikeNumber: 252,
		location: { id: 2, metroName: '인천', localName: '연수구' },
		order: 1,
		views: 1,
		wishes: 0,
		isWish: false,
		photoUrl: 'testUrl',
		nearByFacility: [
			{
				name: 'tmp',
				placeUrl: 'tmpUrl',
				address: 'tmpAddress',
				distance: 'tmpDistance',
				category: 'tmpCategory',
			},
		],
	},
];

export class MockSpotsRepository {
	save = jest.fn();
	findOne = jest.fn().mockReturnThis();
	createQueryBuilder = jest.fn().mockReturnValue({
		innerJoin: jest.fn().mockReturnThis(),
		leftJoin: jest.fn().mockReturnThis(),
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		addSelect: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
		distinct: jest.fn().mockReturnThis(),
		getRawOne: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
		getOne: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		execute: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn().mockReturnThis(),
	});

	async find() {
		return mockSpot;
	}
}
