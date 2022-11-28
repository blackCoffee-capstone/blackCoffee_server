export const mockPostThemes = {
	postId: 1,
	themeid: 1,
};

export class MockPostThemesRepository {
	save = jest.fn().mockResolvedValue(mockPostThemes);

	async find() {
		return mockPostThemes;
	}
}
