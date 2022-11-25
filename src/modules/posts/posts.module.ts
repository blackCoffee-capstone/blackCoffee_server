import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdForm } from 'src/entities/ad-form.entity';
import { ClickPost } from 'src/entities/click-posts.entity';
import { LikePost } from 'src/entities/like-posts.entity';
import { Location } from 'src/entities/locations.entity';
import { PostComment } from 'src/entities/post-comments.entity';
import { PostTheme } from 'src/entities/post-themes.entity';
import { Post } from 'src/entities/posts.entity';
import { Theme } from 'src/entities/theme.entity';
import { AdFormsModule } from '../ad-forms/ad-forms.module';
import { AdFormsService } from '../ad-forms/ad-forms.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
	imports: [
		AdFormsModule,
		TypeOrmModule.forFeature([Location, Post, Theme, PostTheme, PostComment, ClickPost, LikePost, AdForm]),
	],
	controllers: [PostsController],
	providers: [AdFormsService, PostsService],
})
export class PostsModule {}
