import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { SwaggerMethodDoc } from 'src/swagger/swagger-method-doc-type';
import { LikePostRequestDto } from './dto/like-post-request.dto';
import { UserLikesResponseDto } from './dto/user-likes-response.dto';
import { LikesController } from './likes.controller';

export const ApiDocs: SwaggerMethodDoc<LikesController> = {
	likePost(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '커뮤니티 게시글 좋아요',
			}),
			ApiBody({
				type: LikePostRequestDto,
			}),
			ApiResponse({
				status: 201,
				description: '',
				type: Boolean,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
	getUsersLikes(summary: string) {
		return applyDecorators(
			ApiOperation({
				summary,
				description: '사용자의 좋아요 목록 반환',
			}),
			ApiQuery({
				name: 'page',
				required: false,
				description: '페이지 번호 (default=1)',
			}),
			ApiQuery({
				name: 'take',
				required: false,
				description: '페이지 별 데이터 개수 (default=10)',
			}),
			ApiResponse({
				status: 200,
				description: '',
				type: UserLikesResponseDto,
			}),
			ApiBearerAuth('Authorization'),
		);
	},
};
