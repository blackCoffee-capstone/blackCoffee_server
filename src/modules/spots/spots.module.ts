import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { Rank } from 'src/entities/rank.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';
import { RanksService } from '../ranks/ranks.service';
import { RanksModule } from '../ranks/ranks.module';

@Module({
	imports: [RanksModule, TypeOrmModule.forFeature([Spot, Location, Theme, SnsPost, Rank])],
	controllers: [SpotsController],
	providers: [SpotsService, RanksService],
})
export class SpotsModule {}
