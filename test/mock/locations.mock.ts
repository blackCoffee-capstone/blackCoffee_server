export const mockLocation = {
	id: 1,
	metroLocationName: '전라도',
	localLocationName: '고창군',
};

export class MockLocationsRepository {
	save = jest.fn().mockResolvedValue(mockLocation);

	async find() {
		return mockLocation;
	}
}
