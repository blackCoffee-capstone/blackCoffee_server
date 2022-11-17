export const mockTheme = {
	id: 1,
	name: '절',
	photoUrl: 'test.png',
};

export class MockThemeRepository {
	save = jest.fn().mockResolvedValue(mockTheme);

	async find() {
		return mockTheme;
	}
}
