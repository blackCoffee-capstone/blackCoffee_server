import { AdFormType } from 'src/types/ad-form.types';

export const mockReportPost = {
	id: 1,
	userId: 1,
	postId: 1,
	reason: 'test',
	status: AdFormType.Todo,
};

export class MockReportPostsRepository {
	save = jest.fn().mockResolvedValue(mockReportPost);

	async find() {
		return mockReportPost;
	}
}
