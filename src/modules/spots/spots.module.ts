import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ClickSpot } from 'src/entities/click-spots.entity';
import { Location } from 'src/entities/locations.entity';
import { Rank } from 'src/entities/rank.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { RanksModule } from '../ranks/ranks.module';
import { RanksService } from '../ranks/ranks.service';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';

@Module({
	imports: [
		HttpModule,
		RanksModule,
		TypeOrmModule.forFeature([Spot, Location, Theme, SnsPost, Rank, ClickSpot]),
		JwtModule.register({
			secret: process.env.JWT_ACCESS_TOKEN_SECRET,
			signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
		}),
	],
	controllers: [SpotsController],
	providers: [SpotsService, RanksService],
})
export class SpotsModule {}
