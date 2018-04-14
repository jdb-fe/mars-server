import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Post } from '../entities/post.entity';

@Component()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly repository: Repository<Post>,
    ) { }

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
