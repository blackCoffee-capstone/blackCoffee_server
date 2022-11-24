import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';

import { NcloudConfig } from 'src/config/config.constant';
import { Location } from 'src/entities/locations.entity';
import { PostTheme } from 'src/entities/post-themes.entity';
import { Post } from 'src/entities/posts.entity';
import { Theme } from 'src/entities/theme.entity';
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
		@InjectRepository(Theme)
		private readonly themesRepository: Repository<Theme>,
		@InjectRepository(PostTheme)
		private readonly postThemesRepository: Repository<PostTheme>,
		private readonly configService: ConfigService,
	) {}
	#ncloudConfig = this.configService.get<NcloudConfig>('ncloudConfig');

	async createPost(
		userId: number,
		photos: Array<Express.Multer.File>,
		postData: PostsRequestDto,
	): Promise<PostsResponseDto> {
		if (!photos || photos.length === 0) {
			throw new BadRequestException('File is not exist');
		}
		if (photos.length > 5) {
			throw new BadRequestException('Files length exeeds 5');
		}
		if (this.isDuplicateArr(postData.themes)) {
			throw new BadRequestException(`Duplicate value exists in theme list`);
		}
		if (await this.notFoundThemes(postData.themes)) {
			throw new NotFoundException('Theme is not found');
		}

		const metroLocalName = this.getMetroLocalName(postData.location);
		const locationId: number = await this.getLocationId(
			metroLocalName.isOneLevel,
			metroLocalName.metroName,
			metroLocalName.localName,
		);
		const photoUrls = await this.uploadFilesToS3('posts', photos);
		try {
			const post = await this.postsRepository.save({
				title: postData.title,
				content: postData.content,
				photoUrls,
				userId,
				locationId,
			});

			const postsThemes = [];
			for (let i = 0; i < postData.themes.length; i++) {
				postsThemes.push({
					postId: post.id,
					themeId: postData.themes[i],
				});
			}

			await this.postThemesRepository
				.createQueryBuilder('post_theme')
				.insert()
				.into(PostTheme)
				.values(postsThemes)
				.execute();

			return new PostsResponseDto({ id: post.id });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
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
		}
		if (photos.length > 5) {
			throw new BadRequestException('Files length exeeds 5');
		}
		if (postData.themes && this.isDuplicateArr(postData.themes)) {
			throw new BadRequestException(`Duplicate value exists in theme list`);
		}
		if (postData.themes && (await this.notFoundThemes(postData.themes))) {
			throw new NotFoundException('Theme is not found');
		}

		const updateData = {
			title: postData.title ? postData.title : foundUsersPost.title,
			content: postData.content ? postData.content : foundUsersPost.content,
			photoUrls: photos ? [] : foundUsersPost.photo_urls,
			locationId: postData.location ? 0 : foundUsersPost.location_id,
		};

		if (!foundUsersPost) {
			throw new NotFoundException('Post is not found');
		}
		if (postData.location) {
			const metroLocalName = this.getMetroLocalName(postData.location);
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
		try {
			if (postData.themes) {
				await this.postThemesRepository.delete({ postId });
				const postsThemes = [];
				for (let i = 0; i < postData.themes.length; i++) {
					postsThemes.push({
						postId,
						themeId: postData.themes[i],
					});
				}

				await this.postThemesRepository
					.createQueryBuilder('post_theme')
					.insert()
					.into(PostTheme)
					.values(postsThemes)
					.execute();
			}

			await this.postsRepository.update(postId, updateData);
			return new PostsResponseDto({ id: postId });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getPost(userId: number, postId: number): Promise<GetPostsResponseDto> {
		const foundPost = await this.getPostUserId(postId);
		let writer = false;
		if (!foundPost) {
			throw new NotFoundException('Post is not found');
		}
		if (foundPost.user_id === userId) {
			writer = true;
		}
		return new GetPostsResponseDto({
			...foundPost,
			writer,
			location: {
				id: foundPost.location_id,
				metroName: foundPost.metro_name,
				localName: foundPost.local_name,
			},
			themes: await this.getPostsThems(postId),
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

	private getMetroLocalName(location: string) {
		let isOneLevel = false;
		const locationArr: string[] = location.split(' ');
		let metroName = locationArr[0];
		const localName = locationArr[1];

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
				'post.id, post.title, post.content, post.photoUrls, location.id AS location_id, location.metroName, location.localName',
			)
			.leftJoin('post.user', 'user')
			.leftJoin('post.location', 'location')
			.where('user.id = :userId', { userId })
			.andWhere('post.id = :postId', { postId })
			.getRawOne();
	}

	private async getPostsThems(postId: number) {
		return await this.postThemesRepository
			.createQueryBuilder('post_theme')
			.select('theme.id, theme.name')
			.leftJoin('post_theme.post', 'post')
			.leftJoin('post_theme.theme', 'theme')
			.where('post.id = :postId', { postId })
			.getRawMany();
	}

	private isDuplicateArr(arr: any): boolean {
		const set = new Set(arr);

		if (arr.length !== set.size) return true;
		return false;
	}

	private async getPostUserId(postId: number) {
		return await this.postsRepository
			.createQueryBuilder('post')
			.select(
				'user.id AS user_id, post.id, post.title, post.content, post.photoUrls, location.id AS location_id, location.metroName, location.localName',
			)
			.leftJoin('post.user', 'user')
			.leftJoin('post.location', 'location')
			.where('post.id = :postId', { postId })
			.getRawOne();
	}

	private async notFoundThemes(themes: number[]): Promise<boolean> {
		const foundThemes = await this.themesRepository
			.createQueryBuilder('theme')
			.where('theme.id IN (:...themeIds)', { themeIds: themes })
			.getMany();

		if (foundThemes.length !== themes.length) return true;
		return false;
	}
}
