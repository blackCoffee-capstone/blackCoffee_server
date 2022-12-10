export const mockPostCommentIsWriter = {
	id: 1,
	userId: 1,
	postId: 1,
	content: 'content',
	isWriter: true,
	created_at: new Date(),
	user_id: 1,
	nickname: 'test',
};

export const mockPostCommentIsNotWriter = {
	id: 1,
	userId: 1,
	postId: 1,
	content: 'content',
	isWriter: true,
	created_at: new Date(),
	user_id: 1,
	nickname: 'test',
};

export class MockPostCommentsRepository {
	save = jest.fn();
	update = jest.fn();
	create = jest.fn();
	delete = jest.fn();
	createQueryBuilder = jest.fn().mockReturnValue({
		innerJoin: jest.fn().mockReturnThis(),
		leftJoin: jest.fn().mockReturnThis(),
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		addSelect: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
		getRawOne: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
		getOne: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		execute: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn().mockReturnThis(),
		distinct: jest.fn().mockReturnThis(),
	});
	async findIsWriter() {
		return mockPostCommentIsWriter;
	}
	async findIsNotWriter() {
		return mockPostCommentIsNotWriter;
	}
}
