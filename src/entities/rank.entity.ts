import { IsArray } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { CommonEntity } from './common.entity';

@Entity()
export class Rank extends CommonEntity {
	@IsArray()
	@Column({ type: 'int', array: true, default: {} })
	ranking: number[];
}
