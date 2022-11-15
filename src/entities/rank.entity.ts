import { IsNumber } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';

import { CommonEntity } from './common.entity';

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
	@Column({ name: 'spot_id', type: 'smallint', nullable: false })
	spotId: number;

	@IsNumber()
	@Column({ type: 'smallint', nullable: false })
	rank: number;
}
