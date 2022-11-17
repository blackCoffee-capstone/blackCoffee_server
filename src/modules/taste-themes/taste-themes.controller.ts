import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiDocs } from './taste-themes.docs';
import { TasteThemesService } from './taste-themes.service';

@Controller('taste-themes')
@ApiTags('tasteThemes - 여행지 취향 정보')
@UseGuards(JwtAuthGuard)
export class TasteThemesController {
	constructor(private readonly tasteThemesService: TasteThemesService) {}

	@Get()
	@ApiDocs.getTasteThemes('여행지 취향 선택 리스트 반환')
	async getTasteThemes() {
		return await this.tasteThemesService.getTasteThemes();
	}
}
