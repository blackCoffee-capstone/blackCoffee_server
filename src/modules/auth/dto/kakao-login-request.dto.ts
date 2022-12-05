import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class KakaoLoginRequestDto {
	@IsString()
	@ApiProperty({ description: '카카오 서버에서 받은 코드' })
	readonly code: string;
}
