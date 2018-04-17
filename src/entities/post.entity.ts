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
    @Column({
        length: 100
    })
    title: string;

    // 描述
    @Column()
    description: string;

    // 缩略图
    @Column()
    @IsUrl()
    thumb: string;

    // 原文地址
    @Column({
        length: 150,
        unique: true
    })
    @IsUrl()
    url: string;

    // 内容
    @Column('text')
    html: string;

    // markdown内容
    @Column('text')
    markdown: string;

    // 查看数量
    @Column({
        type: 'int',
        default: 0
    })
    views: number;

    // 状态
    @Column({
        type: 'int',
        default: 1
    })
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
