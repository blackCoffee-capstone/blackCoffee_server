import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from './common.entity';
import { Spot } from './spots.entity';
import { Theme } from './theme.entity';

@Entity()
export class SnsPost extends CommonEntity {
	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'theme_id', nullable: true })
	themeId: number;

	@ManyToOne(() => Theme, (theme: Theme) => theme.snsPosts, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	@JoinColumn([{ name: 'theme_id', referencedColumnName: 'id' }])
	theme: Theme;

	@IsNumber()
	@IsNotEmpty()
	@Column({ name: 'spot_id', nullable: true })
	spotId: number;

	@ManyToOne(() => Spot, (spot: Spot) => spot.snsPosts, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	@JoinColumn([{ name: 'spot_id', referencedColumnName: 'id' }])
	spot: Spot;

	@IsDateString()
	@Column({ type: 'timestamptz', nullable: false })
	date: Date;

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
