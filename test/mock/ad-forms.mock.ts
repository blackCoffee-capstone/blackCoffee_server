import { AdFormType } from 'src/types/ad-form.types';

export const mockAdForm = [
	{
		id: 1,
		businessName: 'blackCoffee',
		address: '인천 연수구',
		email: 'test@gmail.com',
		phoneNumber: '010-1234-1234',
		licenseUrl: 'test',
		requirement: 'test',
		status: AdFormType.Todo,
		createdAt: '2022-12-09',
	},
];

export class MockAdFormsRepository {
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
	});
	async find() {
		return mockAdForm;
	}
}
