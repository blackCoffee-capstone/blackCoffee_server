import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasteSpot } from 'src/entities/taste-spots.entity';

import { User } from 'src/entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, TasteSpot])],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
