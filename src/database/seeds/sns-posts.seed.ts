import { Factory, Seeder } from 'typeorm-seeding';

import { SnsPost } from 'src/entities/sns-posts.entity';
import { Connection } from 'typeorm';

const seedSnsPostDatas = [
	{
		themeId: 1,
		spotId: 1,
		date: '2022-02-01',
		likeNumber: 100,
		photoUrl: '100',
		content: '해변가 캠핑',
	},
	{
		themeId: 2,
		spotId: 1,
		date: '2022-02-01',
		likeNumber: 100,
		photoUrl: '100',
		content: '해변가 캠핑',
	},
	{
		themeId: 1,
		spotId: 2,
		date: '2022-02-01',
		likeNumber: 100,
		photoUrl: '100',
		content: '해변가 캠핑',
	},
	{
		themeId: 1,
		spotId: 3,
		date: '2022-02-01',
		likeNumber: 100,
		photoUrl: '100',
		content: '해변가 캠핑',
	},
	{
		themeId: 2,
		spotId: 4,
		date: '2022-02-01',
		likeNumber: 100,
		photoUrl: '100',
		content: '해변가 캠핑',
	},
	{
		themeId: 3,
		spotId: 5,
		date: '2022-02-01',
		likeNumber: 100,
		photoUrl: '100',
		content: '해변가 캠핑',
	},
];

export default class SnsPostsSeed implements Seeder {
	public async run(Factory: Factory, connection: Connection): Promise<void> {
		const currentSnsPosts = await connection.getRepository(SnsPost).createQueryBuilder().select().getMany();

		for (const snsPost of seedSnsPostDatas) {
			const isSnsPostExist = currentSnsPosts.find(
				(currentSnsPost) =>
					currentSnsPost.themeId === snsPost.themeId && currentSnsPost.spotId === snsPost.spotId,
			);

			if (!isSnsPostExist) {
				await connection.getRepository(SnsPost).save(snsPost);
			}
		}
	}
}
