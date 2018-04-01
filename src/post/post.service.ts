import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Post } from './post.entity';

@Component()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    findByPage(page = 1, size = 10): Promise<Post[]> {
        return this.postRepository.find({
            skip: page * size,
            take: size
        });
    }

    findById(id: number) {
        return this.postRepository.findOneById(id);
    }

    count(options?: FindManyOptions<Post>): Promise<number> {
        return this.postRepository.count(options);
    }
}
