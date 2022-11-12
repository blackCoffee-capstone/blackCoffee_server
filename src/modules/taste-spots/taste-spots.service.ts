import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { TasteSpotsLocationResponseDto } from './dto/taste-spots-location-response.dto';
import { TasteSpotsResponseDto } from './dto/taste-spots-response.dto';

@Injectable()
export class TasteSpotsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(SnsPost)
		private readonly snsPostsRepository: Repository<SnsPost>,
	) {}

	async getTasteSpots(): Promise<TasteSpotsResponseDto[]> {
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
				new TasteSpotsResponseDto({
					id: tasteSpot.id,
					name: tasteSpot.name,
					location: new TasteSpotsLocationResponseDto({
						metroName: tasteSpot.metro_name,
						localName: tasteSpot.local_name,
					}),
				}),
		);
	}
}
