import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FacebookUserDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsNumber()
	readonly facebookId: number;

	@IsString()
	readonly email: string;

	constructor({ name, facebookId, email }) {
		this.name = name;
		this.facebookId = facebookId;
		this.email = email;
	}
}
