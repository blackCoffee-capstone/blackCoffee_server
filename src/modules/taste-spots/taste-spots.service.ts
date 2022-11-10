import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Spot } from 'src/entities/spots.entity';
import { TasteSpotsResponseDto } from './dto/taste-spots-response.dto';

@Injectable()
export class TasteSpotsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
	) {}

	async getTasteSpots(length: number): Promise<TasteSpotsResponseDto[]> {
		const tasteSpots = await this.spotsRepository
			.createQueryBuilder('spot')
			.select('spot.id, spot.name, location.name as "locationName"')
			.leftJoin('spot.location', 'location')
			.orderBy('spot.rank', 'ASC')
			.limit(length)
			.getRawMany();

		return tasteSpots.map((tasteSpot) => new TasteSpotsResponseDto(tasteSpot));
	}
}
