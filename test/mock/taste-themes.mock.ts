export const mockTasteTheme = [
	{
		id: 1,
		userId: 1,
		name: '산',
	},
	{
		id: 2,
		userId: 1,
		name: '럭셔리',
	},
	{
		id: 3,
		userId: 1,
		name: '역사',
	},
	{
		id: 4,
		userId: 1,
		name: '웰빙',
	},
	{
		id: 5,
		userId: 1,
		name: '바다',
	},
];

export class MockTasteThemesRepository {
	save = jest.fn();
	findOne = jest.fn();
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
		insert: jest.fn().mockReturnThis(),
		into: jest.fn().mockReturnThis(),
		values: jest.fn().mockReturnThis(),
	});
	async find() {
		return mockTasteTheme;
	}
}
