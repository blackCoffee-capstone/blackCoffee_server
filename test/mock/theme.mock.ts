export const mockTheme = {
	id: 1,
	name: '절',
};

export class MockThemeRepository {
	save = jest.fn().mockResolvedValue(mockTheme);

	async find() {
		return mockTheme;
	}
}
