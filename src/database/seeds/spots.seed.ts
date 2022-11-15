import { Factory, Seeder } from 'typeorm-seeding';

import { Spot } from 'src/entities/spots.entity';
import { Connection } from 'typeorm';

const seedSpotDatas = [
	{
		locationId: 1,
		name: 'test1',
		latitude: 37.253452,
		longitude: 126.234523,
		geom: '(37.253452, 126.234523)',
		rank: 1,
		snsPostCount: 50,
		snsPostLikeNumber: 100,
	},
	{
		locationId: 1,
		name: 'test2',
		latitude: 37.253452,
		longitude: 126.234523,
		geom: '(37.253452, 126.234523)',
		rank: 2,
		snsPostCount: 50,
		snsPostLikeNumber: 100,
	},
	{
		locationId: 2,
		name: 'test3',
		latitude: 37.253452,
		longitude: 126.234523,
		geom: '(37.253452, 126.234523)',
		rank: null,
		snsPostCount: 50,
		snsPostLikeNumber: 100,
	},
	{
		locationId: 2,
		name: 'test4',
		latitude: 37.253452,
		longitude: 126.234523,
		geom: '(37.253452, 126.234523)',
		rank: null,
		snsPostCount: 50,
		snsPostLikeNumber: 100,
	},
	{
		locationId: 2,
		name: 'test5',
		latitude: 37.253452,
		longitude: 126.234523,
		geom: '(37.253452, 126.234523)',
		rank: null,
		snsPostCount: 50,
		snsPostLikeNumber: 100,
	},
	{
		locationId: 2,
		name: 'test6',
		latitude: 37.253452,
		longitude: 126.234523,
		geom: '(37.253452, 126.234523)',
		rank: null,
		snsPostCount: 50,
		snsPostLikeNumber: 100,
	},
];

export default class SpotsSeed implements Seeder {
	public async run(Factory: Factory, connection: Connection): Promise<void> {
		const currentSpots = await connection.getRepository(Spot).createQueryBuilder().select().getMany();

		for (const spot of seedSpotDatas) {
			const isSpotExist = currentSpots.find((currentSpot) => currentSpot.name === spot.name);

			if (!isSpotExist) {
				await connection.getRepository(Spot).save(spot);
			}
		}
	}
}
