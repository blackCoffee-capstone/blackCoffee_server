export const mockTheme = {
	id: 1,
	name: '절',
};

export class MockThemeRepository {
	save = jest.fn().mockResolvedValue(mockTheme);
	find = jest.fn().mockReturnThis();

	async findTheme() {
		return mockTheme;
	}
}
