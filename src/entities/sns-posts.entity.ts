import { IsDateString, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Spot } from './spots.entity';
import { Theme } from './theme.entity';
@Entity()
export class SnsPost extends CommonEntity {
	@ManyToOne(() => Theme, (theme: Theme) => theme.snsPosts, {
		onDelete: 'SET NULL',
	})
	@JoinColumn([{ name: 'theme_id', referencedColumnName: 'id' }])
	theme: Theme;

	@ManyToOne(() => Spot, (spot: Spot) => spot.snsPosts, {
		onDelete: 'SET NULL',
	})
	@JoinColumn([{ name: 'spot_id', referencedColumnName: 'id' }])
	spot: Spot;

	@IsDateString()
	@Column({ type: 'timestamptz', nullable: false })
	date: string;

	@IsNumber()
	@Column({ name: 'like_number', type: 'smallint', nullable: false })
	likeNumber: number;

	@IsString()
	@Column({ name: 'photo_url', type: 'text', nullable: false })
	photoUrl: string;

	@IsString()
	@Column({ type: 'text', nullable: false })
	content: string;
}
