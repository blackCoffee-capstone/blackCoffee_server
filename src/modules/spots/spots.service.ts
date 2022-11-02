import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from 'src/entities/spots.entity';
import { Location } from 'src/entities/locations.entity';
import { SpotRequestDto } from './dto/spot-request.dto';
import { SearchSpotDto } from './dto/search-spot.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { type } from 'os';

@Injectable()
export class SpotsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(Location)
		private readonly locationRepository: Repository<Location>,
	) {}

	async createSpot(responseSpot: SpotRequestDto) {
		let location = await this.locationRepository.findOne({
			where: { id: responseSpot.locationId },
		});
		const spot = this.spotsRepository.create({
			...responseSpot,
			location: location,
		});

		const saveSpot = await this.spotsRepository.save(spot);
		return saveSpot;
	}

	async createLocation(responseLocaiton: LocationResponseDto) {
		const location = await this.locationRepository.save(responseLocaiton);
		return location;
	}

	async getAll() {
		return await this.spotsRepository.find();
	}
}
