import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Theme } from 'src/entities/theme.entity';
import { TasteThemesResponseDto } from './dto/taste-themes-response.dto';

@Injectable()
export class TasteThemesService {
	constructor(
		@InjectRepository(Theme)
		private readonly themesRepository: Repository<Theme>,
	) {}

	async getTasteThemes(): Promise<TasteThemesResponseDto[]> {
		const themes = await this.themesRepository
			.createQueryBuilder('theme')
			.select('theme.id, theme.name, theme.photo_url')
			.limit(25)
			.getRawMany();

		return themes.map((theme) => new TasteThemesResponseDto(theme));
	}
}
