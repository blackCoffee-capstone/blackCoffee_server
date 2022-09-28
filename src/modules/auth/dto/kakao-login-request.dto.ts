import { ApiProperty } from '@nestjs/swagger';

export class KakaoLoginRequestDto {
	@ApiProperty({ description: '카카오 서버에서 받은 엑세스 토큰' })
	readonly accessToken: string;
}
