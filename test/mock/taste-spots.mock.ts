export const mockTasteSpot = {
	id: 1,
	userId: 1,
	spotId: 1,
};

export class MockTasteSpotsRepository {
	save = jest.fn().mockResolvedValue(mockTasteSpot);

	async find() {
		return mockTasteSpot;
	}
}
