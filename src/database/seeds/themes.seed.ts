import { Factory, Seeder } from 'typeorm-seeding';

import { Theme } from 'src/entities/theme.entity';
import { Connection } from 'typeorm';

const seedthemeDatas = [
	{
		name: 't1',
	},
	{
		name: 't2',
	},
	{
		name: 't3',
	},
	{
		name: 't4',
	},
	{
		name: 't5',
	},
	{
		name: 't6',
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
