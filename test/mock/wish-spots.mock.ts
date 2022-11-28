export const mockWishSpot = {
	id: 1,
	userId: 1,
	spotId: 1,
};

export class MockWishSpotsRepository {
	save = jest.fn().mockResolvedValue(mockWishSpot);

	async find() {
		return mockWishSpot;
	}
}
