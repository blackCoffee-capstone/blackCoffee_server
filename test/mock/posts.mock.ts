export const mockPost = {
	id: 1,
	userId: 1,
	locationId: 1,
	title: 'title',
	content: 'content',
	latitude: 37.253452,
	longitude: 126.234523,
	geom: '(37.253452, 126.234523)',
	photoUrls: ['test1', 'test2'],
};

export class MockPostsRepository {
	save = jest.fn().mockResolvedValue(mockPost);

	async find() {
		return mockPost;
	}
}
