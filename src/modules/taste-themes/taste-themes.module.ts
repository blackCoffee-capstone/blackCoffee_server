import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { TasteThemesController } from './taste-themes.controller';
import { TasteThemesService } from './taste-themes.service';

@Module({
	imports: [TypeOrmModule.forFeature([Spot, SnsPost])],
	controllers: [TasteThemesController],
	providers: [TasteThemesService],
})
export class TasteThemesModule {}
