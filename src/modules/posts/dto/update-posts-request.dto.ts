import { PartialType } from '@nestjs/swagger';
import { PostsRequestDto } from './posts-request.dto';

export class UpdatePostsRequestDto extends PartialType(PostsRequestDto) {}
