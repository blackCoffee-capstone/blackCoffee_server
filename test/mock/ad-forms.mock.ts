import { AdFormType } from 'src/types/ad-form.types';

export const mockAdForm = {
	id: 1,
	businessName: 'blackCoffee',
	latitude: 37.253452,
	longitude: 126.234523,
	geom: '(37.253452, 126.234523)',
	email: 'test@gmail.com',
	phoneNumber: '010-1234-1234',
	licenseUrl: 'test',
	requirement: 'test',
	status: AdFormType.Todo,
};

export class MockAdFormsRepository {
	save = jest.fn().mockResolvedValue(mockAdForm);

	async find() {
		return mockAdForm;
	}
}
