import { Factory, Seeder } from 'typeorm-seeding';

import { Location } from 'src/entities/locations.entity';
import { Connection } from 'typeorm';

const seedLocationDatas = [
	{
		metroName: '경기도',
		localName: '수원시',
	},
	{
		metroName: '서울시',
		localName: null,
	},
];

export default class LocationsSeed implements Seeder {
	public async run(Factory: Factory, connection: Connection): Promise<void> {
		const currentLocations = await connection.getRepository(Location).createQueryBuilder().select().getMany();

		for (const location of seedLocationDatas) {
			const isLocationExist = currentLocations.find(
				(currentLocation) =>
					currentLocation.metroName === location.metroName &&
					currentLocation.localName === location.localName,
			);

			if (!isLocationExist) {
				await connection.getRepository(Location).save(location);
			}
		}
	}
}
