import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Spot } from 'src/entities/spots.entity';
import { Rank } from 'src/entities/rank.entity';
import { RanksController } from './ranks.controller';
import { RanksService } from './ranks.service';

@Module({
	imports: [TypeOrmModule.forFeature([Spot, Rank])],

	controllers: [RanksController],
	providers: [RanksService],
	exports: [RanksService],
})
export class RanksModule {}
