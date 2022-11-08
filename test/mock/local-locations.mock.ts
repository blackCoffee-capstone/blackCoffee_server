export const mockLocalLocation = {
	id: 1,
	name: '수원시',
	depth: 2,
};

export class MockLocalLocationsRepository {
	save = jest.fn().mockResolvedValue(mockLocalLocation);

	async find() {
		return mockLocalLocation;
	}
}
