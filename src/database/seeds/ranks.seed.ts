import { Factory, Seeder } from 'typeorm-seeding';

import { Rank } from 'src/entities/rank.entity';
import { Connection } from 'typeorm';

const seedRankDatas = [
	{
		date: 2022104,
		spotId: 2,
		rank: 2,
	},
	{
		date: 2022104,
		spotId: 1,
		rank: 3,
	},
	{
		date: 2022104,
		spotId: 3,
		rank: 1,
	},
	{
		date: 2022105,
		spotId: 3,
		rank: 2,
	},
	{
		date: 2022105,
		spotId: 1,
		rank: 1,
	},
	{
		date: 2022111,
		spotId: 1,
		rank: 1,
	},
	{
		date: 2022111,
		spotId: 2,
		rank: 2,
	},
	{
		date: 2022112,
		spotId: 1,
		rank: 3,
	},
	{
		date: 2022112,
		spotId: 2,
		rank: 2,
	},
	{
		date: 2022112,
		spotId: 3,
		rank: 1,
	},
	{
		date: 2022113,
		spotId: 1,
		rank: 1,
	},
	{
		date: 2022113,
		spotId: 2,
		rank: 2,
	},
];

export default class RanksSeed implements Seeder {
	public async run(Factory: Factory, connection: Connection): Promise<void> {
		const currentRanks = await connection.getRepository(Rank).createQueryBuilder().select().getMany();

		for (const rank of seedRankDatas) {
			const isRankExist = currentRanks.find(
				(currentRank) =>
					currentRank.date === rank.date &&
					currentRank.spotId === rank.spotId &&
					currentRank.rank === rank.rank,
			);

			if (!isRankExist) {
				await connection.getRepository(Rank).save(rank);
			}
		}
	}
}
