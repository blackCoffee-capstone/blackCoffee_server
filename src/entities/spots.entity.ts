import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Geometry } from 'geojson';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Location } from './locations.entity';
import { SnsPost } from './sns-posts.entity';

@Entity()
export class Spot extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'location_id' })
	locationId: number;

	@ManyToOne(() => Location, (location: Location) => location.spots, {
		onDelete: 'SET NULL',
	})
	@JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
	location: Location;

	@IsString()
	@Column({ length: 30, type: 'varchar', nullable: false, unique: true })
	name: string;

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

	@IsNumber()
	@Column({ type: 'smallint', nullable: true })
	rank: number | null;

	@IsNumber()
	@Column({ name: 'sns_post_count', type: 'int', nullable: false })
	snsPostCount: number;

	@IsNumber()
	@Column({ name: 'sns_post_like_number', type: 'int', nullable: false })
	snsPostLikeNumber: number;

	@OneToMany(() => SnsPost, (snsPost: SnsPost) => snsPost.spot, {
		cascade: true,
		eager: true,
	})
	snsPosts: SnsPost[];
}
