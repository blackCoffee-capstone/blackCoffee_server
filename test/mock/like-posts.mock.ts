export const mockLikePost = {
	id: 1,
	userId: 1,
	postId: 1,
};

export class MockLikePostsRepository {
	save = jest.fn().mockResolvedValue(mockLikePost);

	async find() {
		return mockLikePost;
	}
}
