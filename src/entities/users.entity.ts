import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { CommonEntity } from './common.entity';

@Entity()
export class User extends CommonEntity {
	@IsEmail()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false, unique: true })
	email: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false })
	password: string;
}
