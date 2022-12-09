import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';

@Module({
	imports: [TypeOrmModule.forFeature([WishSpot, Spot])],
	controllers: [WishesController],
	providers: [WishesService],
})
export class WishesModule {}
