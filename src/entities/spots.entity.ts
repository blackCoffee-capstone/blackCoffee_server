import { IsLatitude, IsLongitude, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Geometry } from 'geojson';
import { Location } from './locations.entity';
@Entity()
export class Spot extends CommonEntity {
	@ManyToOne(() => Location, (location: Location) => location.spots, {
		onDelete: 'CASCADE',
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

	@IsNumber()
	@Column({ type: 'smallint', nullable: true })
	rank: number | null;

	@IsNumber()
	@Column({ name: 'sns_post_count', type: 'int', nullable: false })
	snsPostCount: number;

	@IsNumber()
	@Column({ name: 'sns_post_like_number', type: 'int', nullable: false })
	snsPostLikeNumber: number;
}
