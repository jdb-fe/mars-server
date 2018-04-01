import { Entity, Column, ManyToOne } from 'typeorm';
import { IsUrl } from 'class-validator';

import { Base } from '../common/base.entity';
import { Post } from '../post/post.entity';

@Entity()
export class Tag extends Base {
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
    @ManyToOne(type => Post, post => post.tags)
    posts: Post[]
}
