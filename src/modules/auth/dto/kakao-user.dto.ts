import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KakaoUserDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsNumber()
	readonly kakaoId: number;

	@IsNotEmpty()
	@IsString()
	readonly email: string;

	@IsNotEmpty()
	@IsDateString()
	readonly birthdate: Date;

	constructor({ name, kakaoId, email, birthdate }) {
		this.name = name;
		this.kakaoId = kakaoId;
		this.email = email;
		this.birthdate = birthdate;
	}
}
