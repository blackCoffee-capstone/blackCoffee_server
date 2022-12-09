import { AuthCodeType } from 'src/types/auth-code.types';

export const mockAuthCode = {
	id: 1,
	email: 'testtest@email.com',
	type: AuthCodeType.SignUpAble,
	code: 'asdfghh',
};

export class MockAuthCodesRepository {
	save = jest.fn();
	findOne = jest.fn();
	update = jest.fn();
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
		return mockAuthCode;
	}
}
