import { IsEmail, IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';
import { Geometry } from 'geojson';
import { Column, Entity } from 'typeorm';

import { AdFormType } from 'src/types/ad-form.types';
import { CommonEntity } from './common.entity';

@Entity()
export class AdForm extends CommonEntity {
	@IsString()
	@IsNotEmpty()
	@Column({ name: 'business_name', type: 'varchar', nullable: false })
	businessName: string;

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

	@IsEmail()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 100, nullable: false })
	email: string;

	@IsString()
	@Column({ name: 'phone_number', length: 15, type: 'varchar', nullable: true })
	phoneNumber: string;

	@IsString()
	@IsNotEmpty()
	@Column({ name: 'license_url', type: 'text', nullable: false })
	licenseUrl: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 1000, nullable: false })
	requirement: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: AdFormType, nullable: false, default: AdFormType.Todo })
	status: AdFormType;
}
