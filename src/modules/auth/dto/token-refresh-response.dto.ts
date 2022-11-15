import { ApiProperty } from '@nestjs/swagger';

export class TokenRefreshResponseDto {
	@ApiProperty({ description: '새로운 access token' })
	readonly accessToken: string;

	constructor({ accessToken }) {
		this.accessToken = accessToken;
	}
}
