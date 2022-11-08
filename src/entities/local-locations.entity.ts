import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { MetroLocation } from './metro-locations.entity';
import { Spot } from './spots.entity';

@Entity()
export class LocalLocation extends CommonEntity {
	@ManyToOne(() => MetroLocation, (metroLocation: MetroLocation) => metroLocation.localLocations, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	@JoinColumn([{ name: 'metro_location_id', referencedColumnName: 'id' }])
	metroLocation: MetroLocation;

	@IsNumber()
	@Column({ type: 'smallint', nullable: false })
	depth: number;

	@IsString()
	@Column({ type: 'varchar', length: 20, nullable: false, unique: true })
	name: string;

	@OneToMany(() => Spot, (spot: Spot) => spot.localLocation, {
		cascade: true,
		eager: true,
	})
	spots: Spot[];
}
