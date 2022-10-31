import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class SignUpResponseDto extends UserResponseDto {
	@IsString()
	@ApiProperty({ example: '30분', description: '인증코드 만료시간' })
	readonly expiredAt: string;

	constructor({ id, name, nickname, email, type, birthdate, expiredAt }) {
		super({ id, name, nickname, email, type, birthdate });
		this.expiredAt = expiredAt;
	}
}
