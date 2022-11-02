import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { AuthCodeType } from 'src/types/auth-code.types';
import { CommonEntity } from './common.entity';

@Entity()
export class AuthCode extends CommonEntity {
	// type = SignUp (회원가입을 위한 인증코드)
	// type = FindPw (비밀번호 찾기를 위한 인증코드)

	@IsEmail()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false, unique: true })
	email: string;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: AuthCodeType, nullable: false })
	type: AuthCodeType;

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'varchar', nullable: false })
	code: string;
}
