import { IsNotEmpty, IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Theme } from './theme.entity';
import { User } from './users.entity';

@Entity()
@Unique(['userId', 'themeId'])
export class TasteTheme extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'user_id' })
	userId: number;

	@ManyToOne(() => User, (user: User) => user.tasteThemes, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([
		{
			name: 'user_id',
			referencedColumnName: 'id',
		},
	])
	user: User;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'theme_id' })
	themeId: number;

	@ManyToOne(() => Theme, (theme: Theme) => theme.tasteThemes, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([
		{
			name: 'theme_id',
			referencedColumnName: 'id',
		},
	])
	theme: Theme;
}
