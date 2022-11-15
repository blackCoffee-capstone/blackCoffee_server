import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Location } from 'src/entities/locations.entity';
import { Theme } from 'src/entities/theme.entity';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

@Module({
	imports: [TypeOrmModule.forFeature([Location, Theme])],
	controllers: [FiltersController],
	providers: [FiltersService],
	exports: [FiltersService],
})
export class FiltersModule {}
