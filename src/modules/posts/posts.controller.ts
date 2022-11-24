import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostCommentsRequestDto } from './dto/post-comments-request.dto';
import { PostsRequestDto } from './dto/posts-request.dto';
import { UpdatePostsRequestDto } from './dto/update-posts-request.dto';
import { ApiDocs } from './posts.docs';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('posts - 커뮤니티 게시글 정보')
@UseGuards(JwtAuthGuard)
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	@UseInterceptors(
		FilesInterceptor('files', 5, {
			fileFilter: (request, file, callback) => {
				if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					callback(null, true);
				} else {
					callback(
						new HttpException(
							{
								message: 1,
								error: '지원하지 않는 이미지 형식입니다.',
							},
							HttpStatus.BAD_REQUEST,
						),
						false,
					);
				}
			},
		}),
	)
	@ApiDocs.createPost('커뮤니티 게시글 저장')
	async createPost(
		@AuthUser() userData,
		@UploadedFiles() photos: Array<Express.Multer.File>,
		@Body() postData: PostsRequestDto,
	) {
		return await this.postsService.createPost(userData.id, photos, postData);
	}

	@Patch(':postId')
	@UseInterceptors(
		FilesInterceptor('files', 5, {
			fileFilter: (request, file, callback) => {
				if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					callback(null, true);
				} else {
					callback(
						new HttpException(
							{
								message: 1,
								error: '지원하지 않는 이미지 형식입니다.',
							},
							HttpStatus.BAD_REQUEST,
						),
						false,
					);
				}
			},
		}),
	)
	@ApiDocs.updatePost('커뮤니티 게시글 수정')
	async updatePost(
		@AuthUser() userData,
		@Param('postId') postId: number,
		@UploadedFiles() photos?: Array<Express.Multer.File>,
		@Body() postData?: UpdatePostsRequestDto,
	) {
		return await this.postsService.updatePost(userData.id, postId, photos, postData);
	}

	@Get(':postId')
	@ApiDocs.getPost('커뮤니티 게시글 상세보기')
	async getPost(@AuthUser() userData, @Param('postId') postId: number) {
		return await this.postsService.getPost(userData.id, postId);
	}

	@Delete(':postId')
	@ApiDocs.deletePost('커뮤니티 게시글 삭제')
	async deletePost(@AuthUser() userData, @Param('postId') postId: number) {
		return await this.postsService.deletePost(userData.id, postId);
	}

	@Post(':postId/comments')
	@ApiDocs.createPostsComments('커뮤니티 게시글 댓글 작성')
	async createPostsComments(
		@AuthUser() userData,
		@Param('postId') postId: number,
		@Body() commentData: PostCommentsRequestDto,
	) {
		return await this.postsService.createPostsComments(userData.id, postId, commentData);
	}

	@Get(':postId/comments')
	@ApiDocs.getPostsComments('커뮤니티 게시글 댓글 목록')
	async getPostsComments(@AuthUser() userData, @Param('postId') postId: number) {
		return await this.postsService.getPostsComments(userData.id, postId);
	}
}
