import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClickPost } from './click-posts.entity';

import { CommonEntity } from './common.entity';
import { LikePost } from './like-posts.entity';
import { Location } from './locations.entity';
import { PostComment } from './post-comments.entity';
import { PostTheme } from './post-themes.entity';
import { ReportPost } from './report-posts.entity';
import { User } from './users.entity';

@Entity()
export class Post extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'user_id' })
	userId: number;

	@ManyToOne(() => User, (user: User) => user.posts, {
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
	@Column({ name: 'location_id', nullable: true })
	locationId: number;

	@ManyToOne(() => Location, (location: Location) => location.posts, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	@JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
	location: Location;

	@IsString()
	@Column({ type: 'varchar', length: 100, nullable: false })
	address: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 30, nullable: false })
	title: string;

	@IsString()
	@Column({ type: 'varchar', length: 1000, nullable: true })
	content: string;

	@IsArray()
	@IsNotEmpty()
	@Column({ name: 'photo_urls', type: 'text', nullable: false, array: true })
	photoUrls: string[];

	@OneToMany(() => PostTheme, (postTheme: PostTheme) => postTheme.post, {
		cascade: true,
		eager: true,
	})
	postThemes: PostTheme[];

	@OneToMany(() => PostComment, (postComment: PostComment) => postComment.post, {
		cascade: true,
		eager: true,
	})
	postComments: PostComment[];

	@OneToMany(() => ClickPost, (clickPosts: ClickPost) => clickPosts.post, {
		cascade: true,
	})
	clickPosts: ClickPost[];

	@OneToMany(() => LikePost, (likePost: LikePost) => likePost.post, {
		cascade: true,
	})
	likePosts: LikePost[];

	@OneToMany(() => ReportPost, (reportPost: ReportPost) => reportPost.post, {
		cascade: true,
	})
	reportPosts: ReportPost[];
}
