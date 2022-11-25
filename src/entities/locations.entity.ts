import { IsString } from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AdForm } from './ad-form.entity';

import { CommonEntity } from './common.entity';
import { Post } from './posts.entity';
import { Spot } from './spots.entity';

@Entity()
@Index(['metroName', 'localName'], { unique: true })
export class Location extends CommonEntity {
	@IsString()
	@Column({ name: 'metro_name', type: 'varchar', length: 10, nullable: false, unique: false })
	metroName: string;

	@IsString()
	@Column({ name: 'local_name', type: 'varchar', length: 10, nullable: true })
	localName: string | null;

	@OneToMany(() => Spot, (spot: Spot) => spot.location, {
		cascade: true,
		eager: true,
	})
	spots: Spot[];

	@OneToMany(() => Post, (post: Post) => post.location, {
		cascade: true,
		eager: true,
	})
	posts: Post[];

	@OneToMany(() => AdForm, (adForm: AdForm) => adForm.location, {
		cascade: true,
		eager: true,
	})
	adForms: AdForm[];
}
