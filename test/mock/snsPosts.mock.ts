export const mockSnsPost = {
	id: 1,
	themeId: 1,
	spotId: 1,
	date: '2022-10-02T05:22:54.000Z',
	likeNumber: 20,
	photoUrl: '링크',
	content: '본문',
};

export class MockSnsPostsRepository {
	save = jest.fn().mockResolvedValue(mockSnsPost);
	createQueryBuilder = jest.fn().mockReturnValue({
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
	});
	findOne = jest.fn().mockReturnThis();

	async find() {
		return mockSnsPost;
	}
}
