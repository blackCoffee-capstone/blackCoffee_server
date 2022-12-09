export const mockSnsPost = [
	{
		id: 1,
		theme: {
			id: 1,
			name: '공원',
			photoUrl: 'photoUrl',
		},
		spot: {
			id: 1,
			name: 'test',
			latitude: 37.253452,
			longitude: 126.234523,
			geom: '(37.253452, 126.234523)',
			address: '인천 연수구 컨벤시아대로',
			rank: 1,
			snsPostCount: 50,
			snsPostLikeNumber: 252,
			location: { id: 2, metroName: '인천', localName: '연수구' },
		},
		date: '2022-10-02T05:22:54.000Z',
		likeNumber: 20,
		snsPostUrl: 'testSnsUrl',
		photoUrl: 'testUrl',
		content: 'testContent',
	},
];

export class MockSnsPostsRepository {
	save = jest.fn().mockResolvedValue(mockSnsPost);
	createQueryBuilder = jest.fn().mockReturnValue({
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
	});
	findOne = jest.fn().mockReturnThis();

	async find() {
		return mockSnsPost;
	}
}
