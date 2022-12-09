import { UserType } from 'src/types/users.types';

export const mockUser = {
	id: 1,
	email: 'testtest@email.com',
	password: '1234abcd!',
	name: 'test',
	nickname: 'test',
	socialId: null,
	type: UserType.Normal,
	isNewUser: false,
	tasteThemes: [1, 2, 3, 4, 5],
};

export class MockUsersRepository {
	save = jest.fn();
	findOne = jest.fn();
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
		getRawMany: jest.fn().mockReturnThis(),
		getRawOne: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockReturnThis(),
		getOne: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		execute: jest.fn().mockReturnThis(),
	});
	async find() {
		return mockUser;
	}
}
