import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { AuthCodeType } from 'src/types/auth-code.types';
import { CommonEntity } from './common.entity';

@Entity()
export class AuthCode extends CommonEntity {
	@IsEmail()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false, unique: true })
	email: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: AuthCodeType, nullable: false })
	type: AuthCodeType;

	@IsString()
	@Column({ type: 'varchar', nullable: true })
	code: string;
}
