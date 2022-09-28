import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class KakaoLoginResponseDto {
	@ApiProperty({ description: 'access token' })
	readonly accessToken: string;

	@ApiProperty({ description: 'refresh token' })
	readonly refreshToken: string;

	@ApiProperty({ description: '사용자 정보' })
	readonly user: UserResponseDto;

	constructor({ accessToken, refreshToken, user }) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.user = new UserResponseDto(user);
	}
}
