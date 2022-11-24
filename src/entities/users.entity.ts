import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { UserType } from 'src/types/users.types';
import { ClickSpot } from './click-spots.entity';
import { CommonEntity } from './common.entity';
import { PostComment } from './post-comments.entity';
import { Post } from './posts.entity';
import { TasteTheme } from './taste-themes.entity';

@Entity()
export class User extends CommonEntity {
	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false })
	name: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false, unique: true })
	nickname: string;

	@IsEmail()
	@Column({ type: 'varchar', nullable: true, unique: true })
	email: string | null;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'social_id', type: 'bigint', nullable: true, unique: true })
	socialId: number;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: UserType, nullable: false })
	type: UserType;

	@IsString()
	@Length(8, 15)
	@Column({ type: 'varchar', nullable: true }) //TODO: strong pw (영어+숫자+특수문자 1개)
	password: string;

	@IsBoolean()
	@Column({ name: 'is_new_user', type: 'boolean', nullable: false, default: true })
	isNewUser: boolean;

	@OneToMany(() => TasteTheme, (tasteTheme: TasteTheme) => tasteTheme.user, {
		cascade: true,
	})
	tasteThemes: TasteTheme[];

	@OneToMany(() => Post, (posts: Post) => posts.user, {
		cascade: true,
	})
	posts: Post[];

	@OneToMany(() => PostComment, (postComment: PostComment) => postComment.user, {
		cascade: true,
	})
	postComments: PostComment[];

	@OneToMany(() => ClickSpot, (clickSpot: ClickSpot) => clickSpot.user, {
		cascade: true,
	})
	clickSpots: ClickSpot[];
}
