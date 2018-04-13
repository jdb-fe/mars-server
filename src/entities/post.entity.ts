import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { IsUrl } from 'class-validator';

import { Base } from './base';
import { Tag } from './tag.entity';

@Entity({
    orderBy: {
        id: 'DESC'
    }
})
export class Post extends Base {
    // 标题
    @Column({ length: 100 })
    title: string;

    // 描述
    @Column()
    description: string;

    // 缩略图
    @Column()
    @IsUrl()
    thumb: string;

    // 内容
    @Column('text')
    content: string;

    // 查看数量
    @Column('int')
    views: number;

    // 状态
    @Column()
    status: number;

    // 标签
    @OneToMany(type => Tag, tag => tag.posts, {
        eager: true,
        cascadeInsert: true,
        cascadeUpdate: true
    })
    @JoinColumn()
    tags: Tag[]
}
