import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Spot } from './spots.entity';

@Entity()
export class Location extends CommonEntity {
	@IsString()
	@Column({ type: 'varchar', nullable: false, unique: true })
	name: string;

	@OneToMany(() => Spot, (spot: Spot) => spot.location, {
		cascade: true,
		eager: true,
	})
	spots: Spot[];
}
