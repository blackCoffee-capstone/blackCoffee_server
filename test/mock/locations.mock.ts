export const mockLocation = [
	{
		id: 1,
		metroName: '인천',
		localName: null,
	},
	{
		id: 2,
		metroName: '인천',
		localName: '연수구',
	},
	{
		id: 3,
		metroName: '인천',
		localName: '계양구',
	},
];

export const mockMetroLocation = [
	{
		id: 1,
		metroName: '인천',
		localName: null,
	},
];

export const mockFilterLocation = [
	{
		id: 1,
		level: 1,
		metro_name: '인천',
		locals: [
			{ id: 2, level: 2, localName: '연수구' },
			{ id: 3, level: 2, localName: '계양구' },
		],
	},
];

export class MockLocationsRepository {
	save = jest.fn();
	findOne = jest.fn().mockReturnThis();
	concat = jest.fn().mockReturnThis();
	flatMap = jest.fn().mockReturnValue({
		call: jest.fn().mockReturnThis(),
	});
	createQueryBuilder = jest.fn().mockReturnValue({
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		getRawMany: jest.fn().mockReturnThis(),
		distinctOn: jest.fn().mockReturnThis(),
		getOne: jest.fn().mockReturnThis(),
	});

	async find() {
		return mockLocation;
	}
	async findFilter() {
		return mockFilterLocation;
	}
	async findMetro() {
		return mockMetroLocation;
	}
}
