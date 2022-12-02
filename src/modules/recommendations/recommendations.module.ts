import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClickSpot } from 'src/entities/click-spots.entity';
import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

@Module({
	imports: [TypeOrmModule.forFeature([Spot, TasteTheme, WishSpot, ClickSpot])],
	controllers: [RecommendationsController],
	providers: [RecommendationsService],
})
export class RecommendationsModule {}
