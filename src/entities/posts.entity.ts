import { IsArray, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Geometry } from 'geojson';
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

	@IsLatitude()
	@Column({ type: 'double precision', nullable: false })
	latitude: number;

	@IsLongitude()
	@Column({ type: 'double precision', nullable: false })
	longitude: number;

	@Column({
		name: 'geom',
		type: 'point',
		spatialFeatureType: 'Point',
		srid: 5186,
		nullable: false,
		comment: 'geom',
	})
	geom: Geometry;

	@IsArray()
	@IsNotEmpty()
	@Column({ name: 'photo_urls', type: 'text', nullable: false, array: true })
	photoUrls: string[];
}
