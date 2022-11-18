import { Factory, Seeder } from 'typeorm-seeding';

import { hash } from 'bcryptjs';
import { User } from 'src/entities/users.entity';
import { UserType } from 'src/types/users.types';
import { Connection } from 'typeorm';

const seedAdminUserData = {
	name: 'admin',
	nickname: 'admin',
	email: process.env.EMAIL,
	password: process.env.EMAIL_PASSWORD,
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
