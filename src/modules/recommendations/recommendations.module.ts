import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

@Module({
	imports: [TypeOrmModule.forFeature([Spot, TasteTheme])],
	controllers: [RecommendationsController],
	providers: [RecommendationsService],
})
export class RecommendationsModule {}
