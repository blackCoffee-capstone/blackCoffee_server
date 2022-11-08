import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { LocalLocation } from 'src/entities/local-locations.entity';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';
import { Theme } from 'src/entities/theme.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { MetroLocation } from 'src/entities/metro-locations.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Spot, MetroLocation, LocalLocation, Theme, SnsPost])],
	controllers: [SpotsController],
	providers: [SpotsService],
})
export class SpotsModule {}
