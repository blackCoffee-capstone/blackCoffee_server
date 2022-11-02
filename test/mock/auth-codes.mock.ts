export const mockAuthCode = {
	id: 1,
	email: 'testtest@email.com',
	type: 'SignUp',
	code: 'asdfghh',
};

export class MockAuthCodesRepository {
	save = jest.fn().mockResolvedValue(mockAuthCode);

	async find() {
		return mockAuthCode;
	}
}
