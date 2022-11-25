import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { GetPostsCommentsResponseDto } from './dto/get-posts-comments-response.dto';
import { GetPostsResponseDto } from './dto/get-posts-response.dto';
import { MainPostsPageResponseDto } from './dto/main-posts-page-response.dto';
import { PostCommentsRequestDto } from './dto/post-comments-request.dto';
import { PostCommentsResponseDto } from './dto/post-comments-response.dto';
import { PostsResponseDto } from './dto/posts-response.dto';
import { PostsController } from './posts.controller';

export const ApiDocs: SwaggerMethodDoc<PostsController> = {
	createPost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 저장',
			}),
			ApiConsumes('multipart/form-data'),
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						title: {
							type: 'string',
						},
						content: {
							type: 'string',
						},
						location: {
							type: 'string',
						},
						themes: {
							type: 'array',
							items: {
								type: 'number',
							},
						},
						files: {
							type: 'array',
							items: {
								type: 'string',
								format: 'binary',
							},
						},
					},
				},
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: PostsResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	updatePost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 수정 (수정할 부분만 명시)',
			}),
			ApiConsumes('multipart/form-data'),
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						title: {
							type: 'string',
						},
						content: {
							type: 'string',
						},
						location: {
							type: 'string',
						},
						themes: {
							type: 'array',
							items: {
								type: 'number',
							},
						},
						files: {
							type: 'array',
							items: {
								type: 'string',
								format: 'binary',
							},
						},
					},
				},
			}),
			ApiParam({
				name: 'postId',
				type: Number,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: PostsResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getPost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 정보 반환',
			}),
			ApiParam({
				name: 'postId',
				type: Number,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: GetPostsResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	deletePost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 삭제',
			}),
			ApiParam({
				name: 'postId',
				type: Number,
			}),
			ApiResponse({
				status: 204,
				description: '삭제 완료',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	createPostsComments(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 댓글 작성',
			}),
			ApiParam({
				name: 'postId',
				type: Number,
			}),
			ApiBody({
				type: PostCommentsRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: PostCommentsResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getPostsComments(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 댓글 목록',
			}),
			ApiParam({
				name: 'postId',
				type: Number,
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: [GetPostsCommentsResponseDto],
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	deletePostsComment(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 댓글 삭제',
			}),
			ApiParam({
				name: 'postId',
				type: Number,
			}),
			ApiParam({
				name: 'commentId',
				type: Number,
			}),
			ApiResponse({
				status: 204,
				description: '삭제 완료',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	likePost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 좋아요',
			}),
			ApiParam({
				name: 'postId',
				type: Number,
			}),
			ApiParam({
				name: 'isLike',
				type: Number,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getMainPost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 메인 게시판(단어 검색, 정렬, 필터링, 페이지네이션)',
			}),
			ApiQuery({
				name: 'word',
				required: false,
				description: '검색어',
			}),
			ApiQuery({
				name: 'sorter',
				required: false,
				description: '정렬 기준 (최신순: CreatedAt)',
			}),
			ApiQuery({
				name: 'page',
				required: false,
				description: '페이지 번호',
			}),
			ApiQuery({
				name: 'take',
				required: false,
				description: '페이지 별 데이터 개수',
			}),
			ApiQuery({
				name: 'locationIds',
				required: false,
				description: '위치 필터링 id list',
			}),
			ApiQuery({
				name: 'themeIds',
				required: false,
				description: '테마 필터링 id list',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: MainPostsPageResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
