import { Factory, Seeder } from 'typeorm-seeding';

import { User } from 'src/entities/users.entity';
import { UserType } from 'src/types/users.types';
import { Connection } from 'typeorm';

const seedAdminUserData = {
	name: 'testAdmin',
	nickname: 'testAdmin',
	email: 'testAdmin@gmail.com',
	type: UserType.Admin,
};

export default class UsersSeed implements Seeder {
	public async run(Factory: Factory, connection: Connection): Promise<void> {
		await connection.createQueryBuilder().insert().into(User).values([seedAdminUserData]).execute();
	}
}
