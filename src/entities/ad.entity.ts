import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Location } from './locations.entity';

@Entity()
export class Ad extends CommonEntity {
	@IsString()
	@IsNotEmpty()
	@Column({ name: 'business_name', type: 'varchar', length: 40, nullable: false })
	businessName: string;

	@IsEmail()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 100, nullable: false })
	email: string;

	@IsString()
	@IsNotEmpty()
	@Column({ name: 'page_url', type: 'text', nullable: false, unique: true })
	pageUrl: string;

	@IsString()
	@IsNotEmpty()
	@Column({ name: 'photo_url', type: 'text', nullable: false })
	photoUrl: string;

	@IsString()
	@Column({ type: 'varchar', length: 100, nullable: false })
	address: string;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'location_id', nullable: true })
	locationId: number;

	@ManyToOne(() => Location, (location: Location) => location.ads, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	@JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
	location: Location;
}
