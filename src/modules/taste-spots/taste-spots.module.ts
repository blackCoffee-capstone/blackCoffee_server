import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { TasteSpotsController } from './taste-spots.controller';
import { TasteSpotsService } from './taste-spots.service';

@Module({
	imports: [TypeOrmModule.forFeature([Spot, SnsPost])],
	controllers: [TasteSpotsController],
	providers: [TasteSpotsService],
})
export class TasteSpotsModule {}
