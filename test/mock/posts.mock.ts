export const mockPost = {
	id: 1,
	userId: 1,
	locationId: 1,
	title: 'title',
	content: 'content',
	photoUrls: ['test1', 'test2'],
};

export class MockPostsRepository {
	save = jest.fn().mockResolvedValue(mockPost);

	async find() {
		return mockPost;
	}
}
