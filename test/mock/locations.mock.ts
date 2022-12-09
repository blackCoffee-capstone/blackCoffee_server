export const mockLocation = [
	{
		id: 2,
		metroName: '인천',
		localName: '연수구',
	},
];

export class MockLocationsRepository {
	save = jest.fn();
	findOne = jest.fn().mockReturnThis();
	concat = jest.fn().mockReturnThis();
	createQueryBuilder = jest.fn().mockReturnValue({
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
		distinctOn: jest.fn().mockReturnThis(),
	});

	async find() {
		return mockLocation;
	}
}
