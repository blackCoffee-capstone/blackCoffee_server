import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { LocalLocation } from './local-locations.entity';

@Entity()
export class MetroLocation extends CommonEntity {
	@OneToMany(() => LocalLocation, (localLocation: LocalLocation) => localLocation.metroLocation, {
		cascade: true,
		eager: true,
	})
	localLocations: LocalLocation[];

	@IsString()
	@Column({ type: 'varchar', length: 20, nullable: false, unique: true })
	name: string;
}
