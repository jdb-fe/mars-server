import { Entity, Column, ManyToOne } from 'typeorm';
import { IsUrl } from 'class-validator';

import { Base } from './base';
import { PostEntity } from './post.entity';

@Entity()
export class TagEntity extends Base {
    // 名称
    @Column({ length: 100 })
    name: string;

    // 缩略图
    @Column()
    @IsUrl()
    thumb: string;

    // 描述
    @Column()
    description: string;

    // 文章
    @ManyToOne(type => PostEntity, post => post.tags)
    posts: PostEntity[]
}
