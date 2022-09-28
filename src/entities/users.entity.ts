import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { UserType } from 'src/types/users.types';
import { CommonEntity } from './common.entity';

@Entity()
export class User extends CommonEntity {
	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false })
	name: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false })
	nickname: string;

	@IsEmail()
	@Column({ type: 'varchar', nullable: true })
	email: string;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'social_id', type: 'bigint', nullable: true, unique: true })
	socialId: number;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: UserType, nullable: false })
	type: UserType;

	@IsString()
	@MinLength(4)
	@MaxLength(20)
	@Column({ type: 'varchar', nullable: true }) //TODO: strong pw
	password: string;

	@IsDateString()
	@Column({ type: 'date', nullable: true })
	birthdate: Date;
}
