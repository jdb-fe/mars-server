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

    async insert(data: IPost) {
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

    findByPage(page = 1, size = 10): Promise<Post[]> {
        return this.repository.find({
            skip: page * size,
            take: size
        });
    }

    findById(id: number) {
        return this.repository.findOneById(id);
    }

    count(options?: FindManyOptions<Post>): Promise<number> {
        return this.repository.count(options);
    }

    findByUrl(url: string) {
        return this.repository.findOne({ url: url });
    }
}
