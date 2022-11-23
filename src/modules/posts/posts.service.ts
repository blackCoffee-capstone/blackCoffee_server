import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';

import { NcloudConfig, OauthConfig } from 'src/config/config.constant';
import { Location } from 'src/entities/locations.entity';
import { Post } from 'src/entities/posts.entity';
import { GetPostsResponseDto } from './dto/get-posts-response.dto';
import { PostsRequestDto } from './dto/posts-request.dto';
import { PostsResponseDto } from './dto/posts-response.dto';
import { UpdatePostsRequestDto } from './dto/update-posts-request.dto';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
		@InjectRepository(Post)
		private readonly postsRepository: Repository<Post>,
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
	) {}
	#oauthConfig = this.configService.get<OauthConfig>('oauthConfig').kakao;
	#ncloudConfig = this.configService.get<NcloudConfig>('ncloudConfig');

	async createPost(
		userId: number,
		photos: Array<Express.Multer.File>,
		postData: PostsRequestDto,
	): Promise<PostsResponseDto> {
		if (!photos || photos.length === 0) {
			throw new BadRequestException('File is not exist');
		} else if (photos.length > 5) {
			throw new BadRequestException('Files length exeeds 5');
		}
		const latitude = Number(postData.latitude);
		const longitude = Number(postData.longitude);
		let locationData;
		try {
			locationData = await firstValueFrom(
				this.httpService.get(
					`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${latitude}&y=${longitude}`,
					{
						headers: {
							Authorization: `KakaoAK ${this.#oauthConfig.clientId}`,
						},
					},
				),
			);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}

		const metroLocalName = this.getMetroLocalName(locationData.data.documents[0]);
		const locationId: number = await this.getLocationId(
			metroLocalName.isOneLevel,
			metroLocalName.metroName,
			metroLocalName.localName,
		);
		const geom = `(${postData.latitude},${postData.longitude})`;
		const photoUrls = await this.uploadFilesToS3('posts', photos);

		const post = await this.postsRepository.save({
			title: postData.title,
			content: postData.content,
			latitude,
			longitude,
			photoUrls,
			geom,
			userId,
			locationId,
		});

		return new PostsResponseDto({ id: post.id });
	}

	async updatePost(
		userId: number,
		postId: number,
		photos?: Array<Express.Multer.File>,
		postData?: UpdatePostsRequestDto,
	): Promise<PostsResponseDto> {
		const foundUsersPost = await this.getUsersPost(userId, postId);

		if (photos && photos.length === 0) {
			throw new BadRequestException('File is not exist');
		} else if (photos.length > 5) {
			throw new BadRequestException('Files length exeeds 5');
		}

		const updateData = {
			title: postData.title ? postData.title : foundUsersPost.title,
			content: postData.content ? postData.content : foundUsersPost.content,
			latitude: postData.latitude ? Number(postData.latitude) : foundUsersPost.latitude,
			longitude: postData.longitude ? Number(postData.longitude) : foundUsersPost.longitude,
			geom: postData.latitude || postData.longitude ? '' : foundUsersPost.geom,
			photoUrls: photos ? [] : foundUsersPost.photo_urls,
			locationId: postData.latitude || postData.longitude ? 0 : foundUsersPost.location_id,
		};
		if (!foundUsersPost) {
			throw new NotFoundException('Post is not found');
		}
		if (postData.latitude || postData.longitude) {
			let locationData;
			updateData.geom = `(${updateData.latitude},${updateData.longitude})`;

			try {
				locationData = await firstValueFrom(
					this.httpService.get(
						`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${updateData.latitude}&y=${updateData.longitude}`,
						{
							headers: {
								Authorization: `KakaoAK ${this.#oauthConfig.clientId}`,
							},
						},
					),
				);
			} catch (error) {
				throw new InternalServerErrorException(error.message, error);
			}
			const metroLocalName = this.getMetroLocalName(locationData.data.documents[0]);
			updateData.locationId = await this.getLocationId(
				metroLocalName.isOneLevel,
				metroLocalName.metroName,
				metroLocalName.localName,
			);
		}

		if (photos) {
			await this.deleteFilesToS3('posts', foundUsersPost.photo_urls);
			updateData.photoUrls = await this.uploadFilesToS3('posts', photos);
		}

		await this.postsRepository.update(postId, updateData);
		return new PostsResponseDto({ id: postId });
	}

	async getPost(userId: number, postId: number): Promise<GetPostsResponseDto> {
		const foundUsersPost = await this.getUsersPost(userId, postId);

		if (!foundUsersPost) {
			throw new NotFoundException('Post is not found');
		}
		return new GetPostsResponseDto({
			...foundUsersPost,
			location: {
				id: foundUsersPost.location_id,
				metroName: foundUsersPost.metro_name,
				localName: foundUsersPost.local_name,
			},
		});
	}

	async deletePost(userId: number, postId: number): Promise<boolean> {
		const foundUsersPost = await this.getUsersPost(userId, postId);

		if (!foundUsersPost) {
			throw new NotFoundException('Post is not found');
		}

		await this.deleteFilesToS3('posts', foundUsersPost.photo_urls);
		await this.postsRepository.delete(postId);
		return true;
	}

	private getMetroLocalName(locationData) {
		let isOneLevel = false;
		let metroName = locationData.region_1depth_name;
		let localName = locationData.region_2depth_name;

		metroName = metroName.split(' ').join('');
		localName = localName.split(' ').join('');

		if (metroName.includes('특별자치도')) {
			isOneLevel = true;
			metroName = metroName.replace(/특별자치도/g, '');
		} else if (metroName.includes('광역시')) {
			isOneLevel = true;
			metroName = metroName.replace(/광역시/g, '');
		} else if (metroName.includes('특별시')) {
			isOneLevel = true;
			metroName = metroName.replace(/특별시/g, '');
		}
		return {
			isOneLevel,
			metroName,
			localName,
		};
	}
	private async getLocationId(isOneLevel: boolean, metroName: string, localName: string): Promise<number> {
		let location = null;
		if (isOneLevel) {
			location = await this.locationsRepository
				.createQueryBuilder('location')
				.select('location.id')
				.where('location.metroName like :metroName', { metroName: `%${metroName}%` })
				.getOne();
		} else {
			location = await this.locationsRepository
				.createQueryBuilder('location')
				.select('location.id')
				.where('location.localName like :localName', { localName: `%${localName}%` })
				.getOne();
		}
		if (!location) {
			throw new BadRequestException('Location is not found');
		}
		return location.id;
	}

	private async uploadFilesToS3(folder: string, files: Array<Express.Multer.File>): Promise<string[]> {
		const photoUrls = [];
		const s3 = new AWS.S3({
			endpoint: new AWS.Endpoint(this.#ncloudConfig.storageEndPoint),
			region: 'kr-standard',
			credentials: {
				accessKeyId: this.#ncloudConfig.accessKeyId,
				secretAccessKey: this.#ncloudConfig.secretAccessKey,
			},
		});
		for (const file of files) {
			const imageName = uuid();
			const fileUrl = `${this.#ncloudConfig.storageEndPoint}/${
				this.#ncloudConfig.storageBucket
			}/${folder}/${imageName}${file.originalname}`;
			await s3
				.putObject({
					Bucket: this.#ncloudConfig.storageBucket,
					Key: `${folder}/${imageName}${file.originalname}`,
					ACL: 'public-read',
					Body: file.buffer,
					ContentType: file.mimetype,
				})
				.promise();
			photoUrls.push(fileUrl);
		}
		return photoUrls;
	}

	private async deleteFilesToS3(folder: string, fileUrls: Array<string>): Promise<boolean> {
		const s3 = new AWS.S3({
			endpoint: new AWS.Endpoint(this.#ncloudConfig.storageEndPoint),
			region: 'kr-standard',
			credentials: {
				accessKeyId: this.#ncloudConfig.accessKeyId,
				secretAccessKey: this.#ncloudConfig.secretAccessKey,
			},
		});
		const objects = [];
		for (const fileUrl of fileUrls) {
			objects.push({
				Key: fileUrl.replace(`${this.#ncloudConfig.storageEndPoint}/${this.#ncloudConfig.storageBucket}/`, ''),
			});
		}
		const deleteParams = {
			Bucket: this.#ncloudConfig.storageBucket,
			Delete: {
				Objects: objects,
				Quiet: false,
			},
		};
		await s3
			.deleteObjects(deleteParams)
			.promise()
			.catch((error) => {
				throw new InternalServerErrorException(error.message, error);
			});
		return true;
	}

	private async getUsersPost(userId: number, postId: number) {
		return await this.postsRepository
			.createQueryBuilder('post')
			.select(
				'post.id, post.title, post.content, post.latitude, post.longitude, post.geom, post.photoUrls, location.id AS location_id, location.metroName, location.localName',
			)
			.leftJoin('post.user', 'user')
			.leftJoin('post.location', 'location')
			.where('user.id = :userId', { userId })
			.andWhere('post.id = :postId', { postId })
			.getRawOne();
	}
}
