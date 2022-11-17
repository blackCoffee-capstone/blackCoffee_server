import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Theme } from 'src/entities/theme.entity';
import { TasteThemesController } from './taste-themes.controller';
import { TasteThemesService } from './taste-themes.service';

@Module({
	imports: [TypeOrmModule.forFeature([Theme])],
	controllers: [TasteThemesController],
	providers: [TasteThemesService],
})
export class TasteThemesModule {}
