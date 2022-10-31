export const mockUser = {
	id: 1,
	email: 'testtest@email.com',
	password: '1234a!',
};

export class MockUsersRepository {
	save = jest.fn().mockResolvedValue(mockUser);

	async find() {
		return mockUser;
	}
}
