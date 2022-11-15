import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { UserType } from 'src/types/users.types';
import { CommonEntity } from './common.entity';
import { TasteSpot } from './taste-spots.entity';

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
	@Column({ type: 'varchar', nullable: true, unique: true })
	email: string | null;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'social_id', type: 'bigint', nullable: true, unique: true })
	socialId: number;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: UserType, nullable: false })
	type: UserType;

	@IsString()
	@Length(2, 10)
	@Column({ type: 'varchar', nullable: true }) //TODO: strong pw
	password: string;

	@IsDateString()
	@Column({ type: 'date', nullable: true })
	birthdate: Date;

	@IsBoolean()
	@Column({ name: 'is_new_user', type: 'boolean', nullable: false, default: true })
	isNewUser: boolean;

	@OneToMany(() => TasteSpot, (tasteSpot: TasteSpot) => tasteSpot.user, {
		cascade: true,
	})
	tasteSpots: TasteSpot[];
}
