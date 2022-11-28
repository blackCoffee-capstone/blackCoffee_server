import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Geometry } from 'geojson';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClickSpot } from './click-spots.entity';

import { CommonEntity } from './common.entity';
import { Location } from './locations.entity';
import { Rank } from './rank.entity';
import { SnsPost } from './sns-posts.entity';
import { WishSpot } from './wish-spots.entity';

@Entity()
export class Spot extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'location_id', nullable: true })
	locationId: number;

	@ManyToOne(() => Location, (location: Location) => location.spots, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	@JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
	location: Location;

	@IsString()
	@Column({ type: 'varchar', nullable: false, unique: true })
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

	@IsString()
	@Column({ type: 'varchar', length: 100, nullable: false })
	address: string;

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

	@OneToMany(() => Rank, (ranking: Rank) => ranking.spot, {
		cascade: true,
	})
	rankings: Rank[];

	@OneToMany(() => ClickSpot, (clickSpot: ClickSpot) => clickSpot.spot, {
		cascade: true,
		eager: true,
	})
	clickSpots: ClickSpot[];

	@OneToMany(() => WishSpot, (wishSpot: WishSpot) => wishSpot.spot, {
		cascade: true,
	})
	wishSpots: WishSpot[];
}
