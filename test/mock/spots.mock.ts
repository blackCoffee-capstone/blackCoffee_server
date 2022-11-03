export const mockSpot = {
	id: 1,
	name: '을왕리',
	latitude: 37.253452,
	longitude: 126.234523,
	geom: '(37.253452, 126.234523)',
	rank: 1,
	snsPostCount: 50,
	snsPostLikeNumber: 252,
};

export class MockSpotsRepository {
	save = jest.fn().mockResolvedValue(mockSpot);

	async find() {
		return mockSpot;
	}
}
