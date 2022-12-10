import { AdFormType } from 'src/types/ad-form.types';

export const mockReportPost = [
	{
		id: 1,
		reason: 'test',
		status: AdFormType.Todo,
		post: {
			id: 1,
		},
		user: {
			email: 'test@gmail.com',
			id: 1,
			isNewUser: false,
			name: 'test',
			nickname: 'test',
			type: 'Normal',
		},
	},
];

export class MockReportPostsRepository {
	save = jest.fn();
	findOne = jest.fn();
	update = jest.fn();
	delete = jest.fn();
	create = jest.fn();
	createQueryBuilder = jest.fn().mockReturnValue({
		innerJoin: jest.fn().mockReturnThis(),
		leftJoin: jest.fn().mockReturnThis(),
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
		getRawOne: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
		getOne: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		execute: jest.fn().mockReturnThis(),
		save: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
	});
	async find() {
		return mockReportPost;
	}
}
