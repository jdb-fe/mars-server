import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindConditions, DeepPartial } from 'typeorm';
import { Post } from '../entities/post.entity';

export interface IPost {
    title: string;
    thumb?: string;
    description?: string;
    html: string;
    url?: string;
}

@Component()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly repository: Repository<Post>,
    ) { }

    async insert(data: IPost) {
        let post = await this.findByUrl(data.url);
        if (!post) {
            post = new Post();
        }
        Object.assign(post, data);
        return this.repository.save(post);
    }

    async findByPage(page = 1, limit = 15) {
        const result = await this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit
        });
        return {
            posts: result[0],
            pages: {
                page: page,
                total: result[1],
                limit: limit,
                totalPage: Math.ceil(result[1] / limit)
            }
        }
    }

    findById(id: number) {
        return this.repository.findOne(id);
    }

    count(options?: FindManyOptions<Post>) {
        return this.repository.count(options);
    }

    findByUrl(url: string) {
        return this.repository.findOne({ url: url });
    }

    find(conditions?: FindConditions<Post>) {
        return this.repository.find(conditions);
    }

    update(criteria: string | string[] | number | number[] | FindConditions<Post>, partialEntity: DeepPartial<Post>) {
        return this.repository.update(criteria, partialEntity);
    }

    /**
     * @desc 获取未推送文章
     */
    async findNonpush() {
        let posts = await this.repository.find({ push: 0 });
        if (posts.length) {
            let update = await this.repository.update(posts.map(post => post.id), { push: 1 });
        }
        return posts;
    }
}
