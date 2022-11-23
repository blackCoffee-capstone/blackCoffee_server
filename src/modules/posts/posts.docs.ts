import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { PostsResponseDto } from './dto/posts-response.dto';
import { PostsController } from './posts.controller';

export const ApiDocs: SwaggerMethodDoc<PostsController> = {
	createPost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 저장',
			}),
			ApiConsumes('multipart/form-data'), //TODO: form-data안에 json 넣는 방식으로 추후 수정 예정
			ApiBody({
				schema: {
					type: 'object',
					properties: {
						json: {
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
};
