import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { TasteThemesLocationResponseDto } from './dto/taste-themes-location-response.dto';
import { TasteThemesResponseDto } from './dto/taste-themes-response.dto';

@Injectable()
export class TasteThemesService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(SnsPost)
		private readonly snsPostsRepository: Repository<SnsPost>,
	) {}

	async getTasteThemes(): Promise<TasteThemesResponseDto[]> {
		//TODO: 알고리즘 수정 예정
		let snsPosts = await this.snsPostsRepository
			.createQueryBuilder('sns_post')
			.select('sns_post.theme_id, Max(sns_post.spot_id) as "spot_id"')
			.leftJoin('sns_post.spot', 'spot')
			.leftJoin('sns_post.theme', 'theme')
			.groupBy('sns_post.theme_id')
			.limit(25)
			.getRawMany();

		snsPosts = snsPosts.map((snsPost) => snsPost.spot_id);

		const tasteSpots = await this.spotsRepository
			.createQueryBuilder('spot')
			.select('spot.id, spot.name, location.metroName , location.localName ')
			.leftJoin('spot.location', 'location')
			.where('spot.id IN (:...ids)', { ids: snsPosts })
			.getRawMany();

		return tasteSpots.map(
			(tasteSpot) =>
				new TasteThemesResponseDto({
					id: tasteSpot.id,
					name: tasteSpot.name,
					location: new TasteThemesLocationResponseDto({
						metroName: tasteSpot.metro_name,
						localName: tasteSpot.local_name,
					}),
				}),
		);
	}
}
