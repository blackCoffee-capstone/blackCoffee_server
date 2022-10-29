import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KakaoUserDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsNumber()
	readonly kakaoId: number;

	@IsString()
	readonly email: string;

	constructor({ name, kakaoId, email }) {
		this.name = name;
		this.kakaoId = kakaoId;
		this.email = email;
	}
}
