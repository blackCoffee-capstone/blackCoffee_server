import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { TasteSpot } from 'src/entities/taste-spots.entity';

import { User } from 'src/entities/users.entity';
import { HashPassword } from '../auth/hash-password';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, TasteSpot, Spot])],
	controllers: [UsersController],
	providers: [UsersService, HashPassword],
})
export class UsersModule {}
