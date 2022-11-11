import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';

@Module({
	imports: [TypeOrmModule.forFeature([Spot, Location, Theme, SnsPost])],
	controllers: [SpotsController],
	providers: [SpotsService],
})
export class SpotsModule {}
