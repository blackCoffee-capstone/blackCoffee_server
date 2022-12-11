export const mockAd = [
	{
		id: 1,
		businessName: 'blackCoffee',
		email: 'test@gmail.com',
		pageUrl: 'https~',
		photoUrl: 'https~',
		click: 0,
		address: test,
		location: {
			id: 31,
			metroName: '인천',
			localName: '연수구',
		},
		createdAt: '2022-12-09',
	},
];

export class MockAdsRepository {
	save = jest.fn();
	findOne = jest.fn();
	update = jest.fn();
	delete = jest.fn();
	create = jest.fn();
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
		save: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
	});
	async find() {
		return mockAd;
	}
}
