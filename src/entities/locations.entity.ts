import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Spot } from './spots.entity';

@Entity()
export class Location extends CommonEntity {
	@IsString()
	@Column({ name: 'metro_name', type: 'varchar', length: 10, nullable: false, unique: false })
	metroName: string;

	@IsString()
	@Column({ name: 'local_name', type: 'varchar', length: 10, nullable: true, unique: true })
	localName: string | null;

	@OneToMany(() => Spot, (spot: Spot) => spot.location, {
		cascade: true,
		eager: true,
	})
	spots: Spot[];
}
