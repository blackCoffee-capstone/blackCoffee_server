import { IsNotEmpty, IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Spot } from './spots.entity';
import { User } from './users.entity';

@Entity()
@Unique(['userId', 'spotId'])
export class WishSpot extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'user_id' })
	userId: number;

	@ManyToOne(() => User, (user: User) => user.wishSpots, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	user: User;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'spot_id' })
	spotId: number;

	@ManyToOne(() => Spot, (spot: Spot) => spot.wishSpots, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'spot_id', referencedColumnName: 'id' }])
	spot: Spot;
}
