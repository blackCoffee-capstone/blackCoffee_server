import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { Location } from 'src/entities/locations.entity';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';

@Module({
	imports: [TypeOrmModule.forFeature([Spot, Location])],
	controllers: [SpotsController],
	providers: [SpotsService],
})
export class SpotsModule {}
