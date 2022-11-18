import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { CommonEntity } from './common.entity';

@Entity()
export class MlSnsPost extends CommonEntity {
	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 30, nullable: false })
	place: string;

	@IsLatitude()
	@Column({ type: 'double precision', nullable: false })
	latitude: number;

	@IsLongitude()
	@Column({ type: 'double precision', nullable: false })
	longitude: number;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'text', nullable: false })
	link: string;

	@IsDateString()
	@IsNotEmpty()
	@Column({ type: 'timestamptz', nullable: false })
	datetime: Date;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 40, nullable: false })
	like: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'text', nullable: false })
	text: string;
}
