import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserMyPageRequestDto } from '../users/dto/user-mypage-request.dto';
import { WishSpotRequestDto } from './dto/wish-spot-request.dto';
import { ApiDocs } from './wishes.docs';
import { WishesService } from './wishes.service';

@Controller('wishes')
@ApiTags('wishes - 여행지 찜하기')
@UseGuards(JwtAuthGuard)
export class WishesController {
	constructor(private readonly wishesService: WishesService) {}

	@Post()
	@ApiDocs.wishSpot('여행지 찜하기')
	async wishSpot(@AuthUser() userData, @Body() wishSpotDto: WishSpotRequestDto) {
		return await this.wishesService.wishSpot(userData.id, wishSpotDto.spotId, wishSpotDto.isWish);
	}

	@Get()
	@ApiDocs.getUsersWishes('사용자의 찜 목록 반환')
	async getUsersWishes(@AuthUser() userData, @Query() usersWishes: UserMyPageRequestDto) {
		return await this.wishesService.getUsersWishes(userData.id, usersWishes);
	}
}
