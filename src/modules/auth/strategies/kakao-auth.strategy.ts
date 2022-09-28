import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KakaoAuthStrategy {
	constructor(private readonly httpService: HttpService) {}
	public async ValidateTokenAndDecode(accessToken: string): Promise<any> {
		const kakaoRequestApiResult = await firstValueFrom(
			this.httpService.get('https://kapi.kakao.com/v2/user/me', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}),
		);
		return kakaoRequestApiResult.data;
	}
}
