import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/entities/locations.entity';
import { Post } from 'src/entities/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
	imports: [HttpModule, TypeOrmModule.forFeature([Location, Post])],
	controllers: [PostsController],
	providers: [PostsService],
})
export class PostsModule {}
