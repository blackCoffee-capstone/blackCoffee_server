import { IsNotEmpty, IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Post } from './posts.entity';
import { Theme } from './theme.entity';

@Entity()
@Unique(['postId', 'themeId'])
export class PostTheme extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'post_id' })
	postId: number;

	@ManyToOne(() => Post, (post: Post) => post.postThemes, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([
		{
			name: 'post_id',
			referencedColumnName: 'id',
		},
	])
	post: Post;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'theme_id' })
	themeId: number;

	@ManyToOne(() => Theme, (theme: Theme) => theme.postThemes, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'theme_id', referencedColumnName: 'id' }])
	theme: Theme;
}
