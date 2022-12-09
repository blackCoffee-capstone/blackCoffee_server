export const mockLocation = {
	id: 1,
	metroName: '경기도',
	localName: '수원시',
};

export class MockLocationsRepository {
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
		distinctOn: jest.fn().mockReturnThis(),
	});

	async findLocation() {
		return mockLocation;
	}
}
