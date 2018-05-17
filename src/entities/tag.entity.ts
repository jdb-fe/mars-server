import { Entity, Column, ManyToOne } from 'typeorm';

import { Base } from './base';
import { Post } from './post.entity';

@Entity()
export class Tag extends Base {
    // 名称
    @Column({ length: 100 })
    name: string;

    // 缩略图
    @Column({
        nullable: true
    })
    thumb: string;

    // 描述
    @Column({
        nullable: true
    })
    description: string;

    // 文章
    @ManyToOne(type => Post, post => post.tags)
    posts: Post[]
}
