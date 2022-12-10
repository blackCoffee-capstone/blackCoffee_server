export const mockClickPost = [
	{
		id: 1,
		userId: 1,
		postId: 1,
	},
];

export class MockClickPostsRepository {
	save = jest.fn().mockResolvedValue(mockClickPost);
	create = jest.fn();

	async find() {
		return mockClickPost;
	}
}
