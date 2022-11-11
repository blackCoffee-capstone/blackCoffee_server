import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Spot } from './spots.entity';

@Entity()
export class Location extends CommonEntity {
	@IsString()
	@Column({ name: 'metro_location_name', type: 'varchar', length: 10, nullable: false, unique: false })
	metroLocationName: string;

	@IsString()
	@Column({ name: 'local_location_name', type: 'varchar', length: 10, nullable: true, unique: true })
	localLocationName: string;

	@OneToMany(() => Spot, (spot: Spot) => spot.location, {
		cascade: true,
		eager: true,
	})
	spots: Spot[];
}
