import { Factory, Seeder } from 'typeorm-seeding';

import { hash } from 'bcryptjs';
import { User } from 'src/entities/users.entity';
import { UserType } from 'src/types/users.types';
import { Connection } from 'typeorm';

const seedAdminUserData = {
	name: 'testAdmin',
	nickname: 'testAdmin',
	email: 'testAdmin@gmail.com',
	password: 'testAdmin',
	type: UserType.Admin,
};

export default class UsersSeed implements Seeder {
	public async run(Factory: Factory, connection: Connection): Promise<void> {
		const currentAdminuser = await connection
			.getRepository(User)
			.createQueryBuilder()
			.select('user')
			.from(User, 'user')
			.where('user.email = :email', {
				email: seedAdminUserData.email,
			})
			.getOne();

		if (!currentAdminuser) {
			seedAdminUserData.password = await hash(seedAdminUserData.password, 10);
			await connection.getRepository(User).save(seedAdminUserData);
		}
	}
}
