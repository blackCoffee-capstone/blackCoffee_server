export const mockMetroLocation = {
	id: 1,
	name: '인천',
};

export class MockMetroLocationsRepository {
	save = jest.fn().mockResolvedValue(mockMetroLocation);

	async find() {
		return mockMetroLocation;
	}
}
