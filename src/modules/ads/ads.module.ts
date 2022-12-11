import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ad } from 'src/entities/ad.entity';
import { Location } from 'src/entities/locations.entity';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';

@Module({
	imports: [TypeOrmModule.forFeature([Ad, Location])],
	controllers: [AdsController],
	providers: [AdsService],
})
export class AdsModule {}
