import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { Rank } from 'src/entities/rank.entity';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';
import { FiltersModule } from '../filters/filters.module';
import { FiltersService } from '../filters/filters.service';

@Module({
	imports: [FiltersModule, TypeOrmModule.forFeature([Spot, Location, Theme, SnsPost, Rank])],
	controllers: [SpotsController],
	providers: [SpotsService, FiltersService],
})
export class SpotsModule {}
