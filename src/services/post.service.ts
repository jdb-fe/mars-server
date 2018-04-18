import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PostEntity } from '../entities/post.entity';

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
        @InjectRepository(PostEntity)
        private readonly repository: Repository<PostEntity>,
    ) { }

    async insert(data: IPost): Promise<PostEntity> {
        /**
         * @desc 检测是否已经存在url
         */
        if (data.url) {
            let post = await this.findByUrl(data.url);
            if (post) {
                return post;
            }
        }
        let post = new PostEntity();
        Object.assign(post, data);
        return this.repository.save(post);
    }

    findByPage(page = 1, size = 10): Promise<PostEntity[]> {
        return this.repository.find({
            skip: page * size,
            take: size
        });
    }

    findById(id: number): Promise<PostEntity> {
        return this.repository.findOneById(id);
    }

    count(options?: FindManyOptions<PostEntity>): Promise<number> {
        return this.repository.count(options);
    }

    findByUrl(url: string): Promise<PostEntity> {
        return this.repository.findOne({ url: url });
    }
}
