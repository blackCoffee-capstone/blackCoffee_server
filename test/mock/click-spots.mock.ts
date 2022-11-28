export const mockClickSpot = {
	id: 1,
	userId: 1,
	spotId: 1,
};

export class MockClickSpotsRepository {
	save = jest.fn().mockResolvedValue(mockClickSpot);

	async find() {
		return mockClickSpot;
	}
}
