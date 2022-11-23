import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { GetPostsResponseDto } from './dto/get-posts-response.dto';
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
						latitude: {
							type: 'number',
						},
						longitude: {
							type: 'number',
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
						latitude: {
							type: 'number',
						},
						longitude: {
							type: 'number',
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
				type: PostsResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
