import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { CommonEntity } from './common.entity';
import { SnsPost } from './sns-posts.entity';
import { TasteTheme } from './taste-themes.entity';

@Entity()
export class Theme extends CommonEntity {
	@IsString()
	@Column({ type: 'varchar', length: 20, nullable: false, unique: true })
	name: string;

	@OneToMany(() => SnsPost, (snsPost: SnsPost) => snsPost.theme, {
		cascade: true,
		eager: true,
	})
	snsPosts: SnsPost[];

	@OneToMany(() => TasteTheme, (tasteTheme: TasteTheme) => tasteTheme.theme, {
		cascade: true,
	})
	tasteThemes: TasteTheme[];
}
