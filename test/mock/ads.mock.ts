export const mockAd = {
	id: 1,
	businessName: 'blackCoffee',
	email: 'test@gmail.com',
	pageUrl: 'https~',
	photoUrl: 'https~',
	locatonId: 1,
};

export class MockAdsRepository {
	save = jest.fn().mockResolvedValue(mockAd);

	async find() {
		return mockAd;
	}
}
