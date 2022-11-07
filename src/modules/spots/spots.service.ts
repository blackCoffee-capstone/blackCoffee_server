import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from 'src/entities/spots.entity';
import { Location } from 'src/entities/locations.entity';
import { SpotRequestDto } from './dto/spot-request.dto';
import { LocationRequestDto } from './dto/location-request.dto';
import { SpotResponseDto } from './dto/spot-response.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { Theme } from 'src/entities/theme.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { ThemeResponseDto } from './dto/theme-response.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SnsPostResponseDto } from './dto/sns-post-response.dto';

@Injectable()
export class SpotsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
		@InjectRepository(Theme)
		private readonly themeRepository: Repository<Theme>,
		@InjectRepository(SnsPost)
		private readonly snsPostRepository: Repository<SnsPost>,
	) {}

	async createSpot(requestSpot: SpotRequestDto) {
		let location = await this.locationsRepository.findOne({ where: { id: requestSpot.locationId } });
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

	async getAllLocation() {
		return await this.locationsRepository.find();
	}

	async createSnsPost(requestSnsPost: SnsPostRequestDto) {
		let theme = await this.themeRepository.findOne({ where: { id: requestSnsPost.themeId } });
		let spot = await this.spotsRepository.findOne({ where: { id: requestSnsPost.spotId } });
		let location = await this.locationsRepository.findOne({ where: { id: spot.id } });

		const saveSnsSpot = await this.snsPostRepository.save({ ...requestSnsPost, theme, spot });

		const snsPostTheme = new ThemeResponseDto({ ...theme });
		const snsPostSpot = new SpotResponseDto({ ...spot, location });
		return new SnsPostResponseDto({ ...saveSnsSpot, theme: snsPostTheme, spot: snsPostSpot });
	}

	async getAllSnsPost() {
		return await this.snsPostRepository.find();
	}

	async createTheme(requestTheme: ThemeRequestDto) {
		const theme = await this.themeRepository.save(requestTheme);
		return new ThemeResponseDto(theme);
	}

	async getAllTheme() {
		return await this.themeRepository.find();
	}
}
