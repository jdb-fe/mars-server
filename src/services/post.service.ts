import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindConditions, DeepPartial } from 'typeorm';
import { Post } from '../entities/post.entity';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { WechatService } from '../services/wechat.service';

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
        private readonly userService: UserService,
        private readonly wechatService: WechatService,
    ) { }

    async insert(data: IPost, openid?: string) {
        let post = await this.findByUrl(data.url);
        if (!post) {
            post = new Post();
        }
        if (!post.user && openid) {
            post.user = await this.getUser(openid);
        }
        Object.assign(post, data);
        return this.repository.save(post);
    }

    private async getUser(openid: string): Promise<User> {
        let user = await this.userService.findByOpenId(openid);
        if (user) {
            return user;
        }
        let wechatUser = await this.wechatService.findByOpenId(openid);
        if (wechatUser) {
            user = new User();
            Object.assign(user, wechatUser);
            return user;
        }
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
}
