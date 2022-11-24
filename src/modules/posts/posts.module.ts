import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/entities/locations.entity';
import { PostComment } from 'src/entities/post-comments.entity';
import { PostTheme } from 'src/entities/post-themes.entity';
import { Post } from 'src/entities/posts.entity';
import { Theme } from 'src/entities/theme.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
	imports: [TypeOrmModule.forFeature([Location, Post, Theme, PostTheme, PostComment])],
	controllers: [PostsController],
	providers: [PostsService],
})
export class PostsModule {}
