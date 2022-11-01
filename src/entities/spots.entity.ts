import { IsArray, isEmpty, IsLatitude, IsLongitude, IsNumber, IsString } from 'class-validator';
import { Column, Entity, IsNull } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Geometry } from 'geojson';
import { Exclude } from 'class-transformer';

@Entity()
export class Spot extends CommonEntity {
	@IsNumber()
	@Column({ type: 'int', nullable: false })
	locationId: number;

	@IsString()
	@Column({ type: 'varchar', nullable: false })
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
	@Column({ type: 'int', nullable: false })
	snsPostCount: number;

	@IsNumber()
	@Column({ type: 'int', nullable: true })
	snsPostLikeNumber: number | null;
}
