import { IsNotEmpty, IsNumber } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Spot } from './spots.entity';

@Entity()
@Index(['year', 'month', 'week', 'spotId', 'rank'], { unique: true })
export class Rank extends CommonEntity {
	@IsNumber()
	@Column({ type: 'smallint', nullable: false })
	year: number;

	@IsNumber()
	@Column({ type: 'smallint', nullable: false })
	month: number;

	@IsNumber()
	@Column({ type: 'smallint', nullable: false })
	week: number;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'spot_id' })
	spotId: number;

	@ManyToOne(() => Spot, (spot: Spot) => spot.rankings, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'spot_id', referencedColumnName: 'id' }])
	spot: Spot;

	@IsNumber()
	@Column({ type: 'smallint', nullable: false })
	rank: number;
}
