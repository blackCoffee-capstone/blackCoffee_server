import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { AdFormType } from 'src/types/ad-form.types';
import { CommonEntity } from './common.entity';

@Entity()
export class AdForm extends CommonEntity {
	@IsString()
	@IsNotEmpty()
	@Column({ name: 'business_name', type: 'varchar', length: 40, nullable: false })
	businessName: string;

	@IsString()
	@Column({ type: 'varchar', length: 100, nullable: false })
	address: string;

	@IsEmail()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 100, nullable: false })
	email: string;

	@IsString()
	@Column({ name: 'phone_number', length: 15, type: 'varchar', nullable: true })
	phoneNumber: string;

	@IsString()
	@IsNotEmpty()
	@Column({ name: 'license_url', type: 'text', nullable: false })
	licenseUrl: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', length: 1000, nullable: false })
	requirement: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: AdFormType, nullable: false, default: AdFormType.Todo })
	status: AdFormType;
}
