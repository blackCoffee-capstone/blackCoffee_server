import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { Spot } from 'src/entities/spots.entity';
import { Rank } from 'src/entities/rank.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { RanksController } from './ranks.controller';
import { RanksService } from './ranks.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Spot, Rank, WishSpot]),
		JwtModule.register({
			secret: process.env.JWT_ACCESS_TOKEN_SECRET,
			signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
		}),
	],

	controllers: [RanksController],
	providers: [RanksService],
	exports: [RanksService],
})
export class RanksModule {}
