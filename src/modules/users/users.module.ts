import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikePost } from 'src/entities/like-posts.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { Theme } from 'src/entities/theme.entity';

import { User } from 'src/entities/users.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { HashPassword } from '../auth/hash-password';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, TasteTheme, Theme, WishSpot, LikePost])],
	controllers: [UsersController],
	providers: [UsersService, HashPassword],
})
export class UsersModule {}
