import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OauthUserDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsNumber()
	readonly socialId: number;

	@IsString()
	readonly email: string;

	constructor({ name, socialId, email }) {
		this.name = name;
		this.socialId = socialId;
		this.email = email;
	}
}
