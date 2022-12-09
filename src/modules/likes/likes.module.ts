import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikePost } from 'src/entities/like-posts.entity';
import { Post } from 'src/entities/posts.entity';
import { User } from 'src/entities/users.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
	imports: [TypeOrmModule.forFeature([Post, LikePost, User])],
	controllers: [LikesController],
	providers: [LikesService],
})
export class LikesModule {}
