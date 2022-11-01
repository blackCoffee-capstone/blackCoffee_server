import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';

@Module({
	imports: [TypeOrmModule.forFeature([Spot])],
	controllers: [SpotsController],
	providers: [SpotsService],
})
export class SpotsModule {}
