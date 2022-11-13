export const mockRank = {
	id: 1,
	ranking: [1, 2, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 24],
};

export class MockRankRepository {
	save = jest.fn().mockResolvedValue(mockRank);

	async find() {
		return mockRank;
	}
}
