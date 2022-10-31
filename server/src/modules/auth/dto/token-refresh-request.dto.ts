import { ApiProperty } from '@nestjs/swagger';

export class TokenRefreshRequestDto {
	@ApiProperty({ description: 'refresh token' })
	readonly refreshToken: string;
}
