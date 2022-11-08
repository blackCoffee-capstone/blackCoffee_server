export const mockSnsPost = {
	id: 1,
	themeId: 4,
	spotId: 1,
	date: '2022-10-02T05:22:54.000Z',
	likeNumber: 20,
	photoUrl: 'https://www.instagram.com/p/CjOmdOzvfD5/',
	content: '평범하지만 행복한 여행 추억',
};

export class MockSnsPostsRepository {
	save = jest.fn().mockResolvedValue(mockSnsPost);

	async find() {
		return mockSnsPost;
	}
}
