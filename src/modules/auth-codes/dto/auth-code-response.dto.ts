import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AuthCodeResponseDto {
	@IsNumber()
	@ApiProperty({ example: 30, description: '인증코드 만료기간' })
	readonly expiredAt: number;

	constructor({ expiredAt }) {
		this.expiredAt = expiredAt;
	}
}
