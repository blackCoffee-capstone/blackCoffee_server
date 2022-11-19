export const mockTasteTheme = {
	id: 1,
	userId: 1,
	themeId: 1,
};

export class MockTasteThemesRepository {
	save = jest.fn().mockResolvedValue(mockTasteTheme);

	async find() {
		return mockTasteTheme;
	}
}
