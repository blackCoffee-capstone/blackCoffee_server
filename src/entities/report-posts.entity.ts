import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AdFormType } from 'src/types/ad-form.types';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Post } from './posts.entity';
import { User } from './users.entity';

@Entity()
@Unique(['userId', 'postId'])
export class ReportPost extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'user_id' })
	userId: number;

	@ManyToOne(() => User, (user: User) => user.reportPosts, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	user: User;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'post_id' })
	postId: number;

	@ManyToOne(() => Post, (post: Post) => post.reportPosts, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([
		{
			name: 'post_id',
			referencedColumnName: 'id',
		},
	])
	post: Post;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 100, nullable: false })
	reason: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: AdFormType, nullable: false, default: AdFormType.Todo })
	status: AdFormType;
}
