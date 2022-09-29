import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AuthCodeType } from 'src/types/auth-code.types';
import { CommonEntity } from './common.entity';
import { User } from './users.entity';

@Entity()
export class AuthCode extends CommonEntity {
	// type = SignUp (이메일 인증 전 회원가입 중 유저)
	// type = FindPw (비밀번호 찾기 중 이메일 인증 안한 유저) TODO: 인증 후 비밀번호 재설정할때 인증확인 요소 설정
	// authcode X (이메일 인증한 유저)

	@IsString()
	@IsNotEmpty()
	@Column({ type: 'enum', enum: AuthCodeType, nullable: false })
	type: AuthCodeType;

	@IsString()
	@Column({ type: 'varchar', nullable: true })
	code: string;

	@IsNumber()
	@IsNotEmpty()
	@Column({ type: 'int', name: 'user_id', nullable: false })
	userId: number;

	@OneToOne(() => User, (user: User) => user.authCode, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	User: User;
}
