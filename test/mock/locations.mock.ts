export const mockLocation = {
	id: 1,
	metroLocationName: '경기도',
	localLocationName: '수원시',
};

export class MockLocationsRepository {
	save = jest.fn().mockResolvedValue(mockLocation);

	async find() {
		return mockLocation;
	}
}
