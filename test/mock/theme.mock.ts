export const mockTheme = [
	{
		id: 1,
		name: '산',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/mountain.png',
	},
	{
		id: 2,
		name: '럭셔리',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/luxury.png',
	},
	{
		id: 3,
		name: '역사',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/history.png',
	},
	{
		id: 4,
		name: '웰빙',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/wellbing.png',
	},
	{
		id: 5,
		name: '바다',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/sea.png',
	},
];

export class MockThemeRepository {
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
	});
	async find() {
		return mockTheme;
	}
}
