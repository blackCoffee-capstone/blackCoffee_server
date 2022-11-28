import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportPost } from 'src/entities/report-posts.entity';
import { ReportPostsController } from './report-posts.controller';
import { ReportPostsService } from './report-posts.service';

@Module({
	imports: [TypeOrmModule.forFeature([ReportPost])],
	controllers: [ReportPostsController],
	providers: [ReportPostsService],
})
export class ReportPostsModule {}
