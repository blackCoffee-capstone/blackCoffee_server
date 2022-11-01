import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from 'src/entities/spots.entity';
import { ResponseSpotDto } from './dto/response-spot.dto';

@Injectable()
export class SpotsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
	) {}

	create(responseSpot: ResponseSpotDto) {
		const spot = this.spotsRepository.save(responseSpot);
		return spot;
	}
}
