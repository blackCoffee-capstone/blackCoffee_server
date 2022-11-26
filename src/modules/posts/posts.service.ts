import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';

import { NcloudConfig } from 'src/config/config.constant';
import { ClickPost } from 'src/entities/click-posts.entity';
import { LikePost } from 'src/entities/like-posts.entity';
import { Location } from 'src/entities/locations.entity';
import { PostComment } from 'src/entities/post-comments.entity';
import { PostTheme } from 'src/entities/post-themes.entity';
import { Post } from 'src/entities/posts.entity';
import { ReportPost } from 'src/entities/report-posts.entity';
import { Theme } from 'src/entities/theme.entity';
import { UserType } from 'src/types/users.types';
import { AdFormsService } from '../ad-forms/ad-forms.service';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { CommentsUserResponseDto } from '../users/dto/comments-user-response.dto';
import { GetPostsCommentsResponseDto } from './dto/get-posts-comments-response.dto';
import { GetPostsResponseDto } from './dto/get-posts-response.dto';
import { MainPostsPageResponseDto } from './dto/main-posts-page-response.dto';
import { MainPostsRequestDto } from './dto/main-posts-request.dto';
import { MainPostsResponseDto } from './dto/main-posts-response.dto';
import { PostCommentsRequestDto } from './dto/post-comments-request.dto';
import { PostCommentsResponseDto } from './dto/post-comments-response.dto';
import { PostsRequestDto } from './dto/posts-request.dto';
import { PostsResponseDto } from './dto/posts-response.dto';
import { ReportPostsRequestDto } from './dto/report-posts-request.dto';
import { ReportPostsResponseDto } from './dto/report-posts-response.dto';
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
		@InjectRepository(PostComment)
		private readonly postCommentsRepository: Repository<PostComment>,
		@InjectRepository(ClickPost)
		private readonly clickPostsRepository: Repository<ClickPost>,
		@InjectRepository(LikePost)
		private readonly likePostsRepository: Repository<LikePost>,
		@InjectRepository(ReportPost)
		private readonly reportPostsRepository: Repository<ReportPost>,
		private readonly adFormsService: AdFormsService,
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

		const metroLocalName = this.adFormsService.getMetroLocalName(postData.address);
		const locationId: number = await this.adFormsService.getAddressLocationId(
			metroLocalName.isOneLevel,
			metroLocalName.metroName,
			metroLocalName.localName,
		);
		const photoUrls = await this.uploadFilesToS3('posts', photos);
		try {
			const post = await this.postsRepository.save({
				title: postData.title,
				content: postData.content,
				address: postData.address,
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
			address: postData.address ? postData.address : foundUsersPost.address,
			locationId: postData.address ? 0 : foundUsersPost.location_id,
		};

		if (!foundUsersPost) {
			throw new NotFoundException('Post is not found');
		}
		if (postData.address) {
			const metroLocalName = this.adFormsService.getMetroLocalName(postData.address);
			updateData.locationId = await this.adFormsService.getAddressLocationId(
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
		let isWriter = false;
		const foundPost = await this.getPostUserId(postId);
		if (!foundPost) {
			throw new NotFoundException('Post is not found');
		}
		if (foundPost.user.id === userId) {
			isWriter = true;
		}
		try {
			const clickPostData = this.clickPostsRepository.create({
				userId,
				postId,
			});
			await this.clickPostsRepository.save(clickPostData);
			return new GetPostsResponseDto({
				...foundPost,
				views: foundPost.clickPosts.length + 1,
				likes: foundPost.likePosts.length,
				isLike: this.isLikePost(userId, foundPost.likePosts) ? true : false,
				isWriter,
				location: new LocationResponseDto(foundPost.location),
				user: new CommentsUserResponseDto(foundPost.user),
				themes: await this.getPostsThems(postId),
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async deletePost(userId: number, role: UserType, postId: number): Promise<boolean> {
		const foundUsersPost = await this.getUsersPost(userId, postId);

		if (!foundUsersPost && role !== UserType.Admin) {
			throw new NotFoundException('Post is not found');
		}

		await this.deleteFilesToS3('posts', foundUsersPost.photo_urls);
		await this.postsRepository.delete(postId);
		return true;
	}

	async createPostsComments(
		userId: number,
		postId: number,
		commentData: PostCommentsRequestDto,
	): Promise<PostCommentsResponseDto> {
		const foundPost = await this.getPostUserId(postId);
		if (!foundPost) {
			throw new NotFoundException('Post is not found');
		}
		const comment = this.postCommentsRepository.create({
			userId,
			postId,
			content: commentData.content,
		});
		const result = await this.postCommentsRepository.save(comment);
		return new PostCommentsResponseDto(result);
	}

	async getPostsComments(userId: number, postId: number): Promise<GetPostsCommentsResponseDto[]> {
		const foundPost = await this.getPostUserId(postId);
		if (!foundPost) {
			throw new NotFoundException('Post is not found');
		}
		const foundComments = await this.getComments(postId);

		return foundComments.map(
			(comment) =>
				new GetPostsCommentsResponseDto({
					...comment,
					isWriter: comment.user_id === userId ? true : false,
					user: new CommentsUserResponseDto({
						id: comment.user_id,
						nickname: comment.nickname,
					}),
				}),
		);
	}

	async deletePostsComment(userId: number, postId: number, commentId: number): Promise<boolean> {
		const foundPost = await this.getPostUserId(postId);
		if (!foundPost) {
			throw new NotFoundException('Post is not found');
		}
		const foundComment = await this.getComment(postId, commentId, userId);
		if (!foundComment) {
			throw new NotFoundException('Comment is not found');
		}
		await this.postCommentsRepository.delete(commentId);
		return true;
	}

	async likePost(userId: number, postId: number, isLike: boolean): Promise<boolean> {
		const foundPost = await this.getPostUserId(postId);
		if (!foundPost) {
			throw new NotFoundException('Post is not found');
		}
		if (isLike) {
			const isLikePost = await this.likePostsRepository
				.createQueryBuilder('likePost')
				.where('likePost.userId = :userId', { userId })
				.andWhere('likePost.postId = :postId', { postId })
				.getOne();
			if (!isLikePost) {
				const likePost = this.likePostsRepository.create({
					userId,
					postId,
				});
				await this.likePostsRepository.save(likePost);
			} else throw new BadRequestException('User already likes post');
		} else {
			await this.likePostsRepository.delete({
				userId,
				postId,
			});
		}
		return true;
	}

	async reportPost(
		userId: number,
		postId: number,
		reportData: ReportPostsRequestDto,
	): Promise<ReportPostsResponseDto> {
		const foundPost = await this.getPostUserId(postId);
		if (!foundPost) {
			throw new NotFoundException('Post is not found');
		}
		if (foundPost.user.id === userId) {
			throw new BadRequestException('User is writer');
		}
		if (await this.getUsersReportPost(userId, postId)) {
			throw new BadRequestException('User already reports post');
		}
		const reportPost = this.reportPostsRepository.create({
			userId,
			postId,
			reason: reportData.reason,
		});
		const result = await this.reportPostsRepository.save(reportPost);

		return new ReportPostsResponseDto({ id: result.id });
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
				.promise()
				.catch((error) => {
					throw new InternalServerErrorException(error.message, error);
				});
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
				'post.id, post.address, post.title, post.content, post.photoUrls, location.id AS location_id, location.metroName, location.localName',
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
			.leftJoinAndSelect('post.user', 'user')
			.leftJoinAndSelect('post.location', 'location')
			.leftJoinAndSelect('post.clickPosts', 'clickPosts')
			.leftJoinAndSelect('post.likePosts', 'likePosts')
			.where('post.id = :postId', { postId })
			.getOne();
	}

	private async getComments(postId: number) {
		return await this.postCommentsRepository
			.createQueryBuilder('post_comment')
			.select('post_comment.id, post_comment.content, post_comment.created_at, user.id AS user_id, user.nickname')
			.leftJoin('post_comment.user', 'user')
			.leftJoin('post_comment.post', 'post')
			.where('post.id = :postId', { postId })
			.orderBy('post_comment.created_at', 'ASC')
			.getRawMany();
	}

	private async getComment(postId: number, commentId: number, userId: number) {
		return await this.postCommentsRepository
			.createQueryBuilder('post_comment')
			.select(
				'post_comment.id, post_comment.content, post_comment.is_writer, post_comment.created_at, user.id AS user_id, user.nickname',
			)
			.leftJoin('post_comment.user', 'user')
			.leftJoin('post_comment.post', 'post')
			.where('post.id = :postId', { postId })
			.andWhere('post_comment.id = :commentId', { commentId })
			.andWhere('user.id = :userId', { userId })
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

	private async allSelection(locationIds) {
		return await this.locationsRepository
			.createQueryBuilder('location')
			.leftJoinAndSelect('location.spots', 'spots')
			.select('location.id AS id')
			.where((metroNames) => {
				const subQuery = metroNames
					.subQuery()
					.select('location.metroName')
					.where('location.localName is null')
					.andWhere('location.id IN (:...ids)', { ids: locationIds })
					.from(Location, 'location')
					.getQuery();
				return 'location.metroName IN' + subQuery;
			})
			.andWhere('spots.id is not null')
			.distinctOn(['location.id'])
			.getRawMany();
	}

	async getMainPost(userId: number, searchRequest: MainPostsRequestDto) {
		try {
			let posts = this.postsRepository
				.createQueryBuilder('post')
				.leftJoinAndSelect('post.location', 'location')
				.leftJoinAndSelect('post.clickPosts', 'clickPosts')
				.leftJoinAndSelect('post.likePosts', 'likePosts')
				.orderBy(`post.${searchRequest.sorter}`, 'ASC');

			if (searchRequest.word) {
				posts = posts.where('post.title Like :title', { title: `%${searchRequest.word}%` });
			}
			if (searchRequest.locationIds) {
				let locationIds = searchRequest.locationIds;
				const allMetros = await this.allSelection(locationIds);
				const localsIds = Array.from(allMetros).flatMap(({ id }) => [id]);
				locationIds = [...new Set(locationIds.concat(localsIds))];

				posts = posts.andWhere('location.id IN (:...locationIds)', { locationIds: locationIds });
			}

			if (searchRequest.themeIds) {
				posts = posts
					.leftJoinAndSelect('post.postThemes', 'postThemes')
					.leftJoinAndSelect('postThemes.theme', 'theme')
					.andWhere('theme.id IN (:...themeIds)', { themeIds: searchRequest.themeIds });
			}

			const totalPagePosts = await posts.getMany();
			const responsePosts = await posts
				.limit(searchRequest.take)
				.offset((searchRequest.page - 1) * searchRequest.take)
				.getMany();

			const totalPage = Math.ceil(totalPagePosts.length / searchRequest.take);
			const postsDto = Array.from(responsePosts).map(
				(post) =>
					new MainPostsResponseDto({
						...post,
						views: post.clickPosts.length,
						likes: post.likePosts.length,
						isLike: this.isLikePost(userId, post.likePosts) ? true : false,
						location: new LocationResponseDto({
							id: post.location.id,
							metroName: post.location.metroName,
							localName: post.location.localName,
						}),
					}),
			);
			return new MainPostsPageResponseDto({ totalPage: totalPage, posts: postsDto });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private isLikePost(userId: number, likePosts: LikePost[]): boolean {
		const isLike = likePosts.find((x) => x.userId === userId);

		if (isLike) return true;
		return false;
	}

	private async getUsersReportPost(userId: number, postId: number) {
		return await this.reportPostsRepository
			.createQueryBuilder('reportPost')
			.leftJoinAndSelect('reportPost.user', 'user')
			.leftJoinAndSelect('reportPost.post', 'post')
			.where('user.id = :userId', { userId })
			.andWhere('post.id = :postId', { postId })
			.getOne();
	}
}
