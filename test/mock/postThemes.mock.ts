export const mockPostThemes = [
	{
		postId: 1,
		themeid: 1,
	},
];

export class MockPostThemesRepository {
	save = jest.fn().mockResolvedValue(mockPostThemes);
	delete = jest.fn();

	createQueryBuilder = jest.fn().mockReturnValue({
		insert: jest.fn().mockReturnThis(),
		into: jest.fn().mockReturnThis(),
		values: jest.fn().mockReturnThis(),
		execute: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		leftJoin: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
	});

	async find() {
		return mockPostThemes;
	}
}
