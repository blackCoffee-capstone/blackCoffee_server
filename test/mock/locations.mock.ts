export const mocklocation = {
	id: 1,
	name: '을왕리',
};

export class MockLocationsRepository {
	save = jest.fn().mockResolvedValue(mocklocation);

	async find() {
		return mocklocation;
	}
}
