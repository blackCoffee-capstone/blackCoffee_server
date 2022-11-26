import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ad } from 'src/entities/ad.entity';
import { AdForm } from 'src/entities/ad-form.entity';
import { Location } from 'src/entities/locations.entity';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
	imports: [TypeOrmModule.forFeature([Ad, AdForm, Location])],
	controllers: [AdminsController],
	providers: [AdminsService],
})
export class AdminsModule {}
