export const mockLocation = {
	id: 1,
	metroName: '경기도',
	localName: '수원시',
};

export class MockLocationsRepository {
	save = jest.fn().mockResolvedValue(mockLocation);

	async find() {
		return mockLocation;
	}
}
