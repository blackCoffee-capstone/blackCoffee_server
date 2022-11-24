import { IsNotEmpty, IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Post } from './posts.entity';
import { User } from './users.entity';

@Entity()
export class LikePost extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'user_id' })
	userId: number;

	@ManyToOne(() => User, (user: User) => user.likePosts, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	user: User;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'post_id' })
	postId: number;

	@ManyToOne(() => Post, (post: Post) => post.likePosts, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
	post: Post;
}
