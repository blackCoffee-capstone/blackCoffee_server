import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Location } from './locations.entity';
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
}
