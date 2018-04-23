import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
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

    async insert(data: IPost): Promise<Post> {
        /**
         * @desc 检测是否已经存在url
         */
        if (data.url) {
            let post = await this.findByUrl(data.url);
            if (post) {
                return post;
            }
        }
        let post = new Post();
        Object.assign(post, data);
        return this.repository.save(post);
    }

    findByPage(page = 1, size = 15): Promise<Post[]> {
        return this.repository.find({
            skip: (page - 1) * size,
            take: size
        });
    }

    findById(id: number): Promise<Post> {
        return this.repository.findOne(id);
    }

    count(options?: FindManyOptions<Post>): Promise<number> {
        return this.repository.count(options);
    }

    findByUrl(url: string): Promise<Post> {
        return this.repository.findOne({ url: url });
    }

    /**
     * @desc 获取未推送文章
     */
    async findNonpush(): Promise<Post[]> {
        let posts = await this.repository.find({ push: 0 });
        if (posts.length) {
            let update = await this.repository.update(posts.map(post => post.id), { push: 1 });
        }
        return posts;
    }
}
