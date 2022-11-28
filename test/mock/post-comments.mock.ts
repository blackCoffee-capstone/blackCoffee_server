export const mockPostComment = {
	id: 1,
	userId: 1,
	postId: 1,
	content: 'content',
	isWriter: false,
};

export class MockPostCommentsRepository {
	save = jest.fn().mockResolvedValue(mockPostComment);

	async find() {
		return mockPostComment;
	}
}
