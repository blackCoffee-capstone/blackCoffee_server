import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from 'src/entities/spots.entity';
import { Location } from 'src/entities/locations.entity';
import { SpotRequestDto } from './dto/spot-request.dto';
import { LocationRequestDto } from './dto/location-request.dto';
import { SpotResponseDto } from './dto/spot-response.dto';
import { LocationResponseDto } from './dto/location-response.dto';

@Injectable()
export class SpotsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
	) {}

	async createSpot(requestSpot: SpotRequestDto) {
		let location = await this.locationsRepository.findOne({
			where: { id: requestSpot.locationId },
		});
		const saveSpot = await this.spotsRepository.save({
			...requestSpot,
			location: location,
		});
		const spotLocation = new LocationResponseDto({
			id: location.id,
			name: location.name,
		});

		return new SpotResponseDto({
			...saveSpot,
			location: spotLocation,
		});
	}

	async createLocation(requestLocaiton: LocationRequestDto) {
		const location = await this.locationsRepository.save(requestLocaiton);
		return new LocationResponseDto(location);
	}

	async getAllSpot() {
		return await this.spotsRepository.find();
	}

	async getAllLocation() {
		return await this.locationsRepository.find();
	}
}
