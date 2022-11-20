import { Factory, Seeder } from 'typeorm-seeding';

import { Theme } from 'src/entities/theme.entity';
import { Connection } from 'typeorm';

const seedthemeDatas = [
	{
		name: '산',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/mountain.png',
	},
	{
		name: '럭셔리',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/luxury.png',
	},
	{
		name: '역사',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/history.png',
	},
	{
		name: '웰빙',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/wellbing.png',
	},
	{
		name: '바다',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/sea.png',
	},
	{
		name: '카페',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/cafe.png',
	},
	{
		name: '공원',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/park.png',
	},
	{
		name: '전시장',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/gallery.png',
	},
	{
		name: '건축',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/architecture.png',
	},
	{
		name: '사찰',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/temple.png',
	},
	{
		name: '가족',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/family.png',
	},
	{
		name: '학교',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/university.png',
	},
	{
		name: '놀이공원',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/amusement-park.png',
	},
	{
		name: '겨울',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/winter.png',
	},
	{
		name: '엑티비티',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/activity.png',
	},
	{
		name: '캠핑',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/camping.png',
	},
	{
		name: '섬',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/island.png',
	},
	{
		name: '커플',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/couple.png',
	},
	{
		name: '저수지',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/reservoir.png',
	},
	{
		name: '폭포',
		photoUrl: 'https://kr.object.ncloudstorage.com/blackcoffee-bucket/themes/waterfall.png',
	},
];

export default class ThemesSeed implements Seeder {
	public async run(Factory: Factory, connection: Connection): Promise<void> {
		const currentThemes = await connection.getRepository(Theme).createQueryBuilder().select().getMany();

		for (const theme of seedthemeDatas) {
			const isThemeExist = currentThemes.find((currentTheme) => currentTheme.name === theme.name);

			if (!isThemeExist) {
				await connection.getRepository(Theme).save(theme);
			}
		}
	}
}
