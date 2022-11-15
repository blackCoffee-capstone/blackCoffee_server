export const mockRank = {
	id: 1,
	year: 2022,
	month: 11,
	week: 3,
	spotId: 1,
	rank: 1,
};

export class MockRankRepository {
	save = jest.fn().mockResolvedValue(mockRank);

	async find() {
		return mockRank;
	}
}
