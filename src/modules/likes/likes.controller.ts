import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserMyPageRequestDto } from '../users/dto/user-mypage-request.dto';
import { LikePostRequestDto } from './dto/like-post-request.dto';
import { ApiDocs } from './likes.docs';
import { LikesService } from './likes.service';

@Controller('likes')
@ApiTags('likes - 커뮤니티 게시글 좋아요')
@UseGuards(JwtAuthGuard)
export class LikesController {
	constructor(private readonly likesService: LikesService) {}

	@Post()
	@ApiDocs.likePost('커뮤니티 게시글 좋아요')
	async likePost(@AuthUser() userData, @Body() likePostDto: LikePostRequestDto) {
		return await this.likesService.likePost(userData.id, likePostDto.postId, likePostDto.isLike);
	}

	@Get()
	@ApiDocs.getUsersLikes('사용자의 좋아요 목록 반환')
	async getUsersLikes(@AuthUser() userData, @Query() usersLikes: UserMyPageRequestDto) {
		return await this.likesService.getUsersLikes(userData.id, usersLikes);
	}
}
