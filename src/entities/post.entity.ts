import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

import { Base } from './base';
import { Tag } from './tag.entity';
import { User } from './user.entity';

export enum PostType {
    SHARE,
    ORIGIN
}

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
    @IsNotEmpty()
    title: string;

    // 描述
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    // 缩略图
    @Column({
        nullable: true,
        length: 500
    })
    thumb: string;

    // 原文地址
    @Column({
        nullable: true,
        length: 500
    })
    url: string;

    // 内容
    @Column('mediumtext')
    @IsNotEmpty()
    html: string;

    // markdown内容
    @Column({
        type: 'mediumtext',
        nullable: true
    })
    markdown: string;

    // 文章类型
    @Column({
        type: 'tinyint',
        default: PostType.SHARE
    })
    type: number

    // 查看数量
    @Column({
        type: 'int',
        default: 0
    })
    views: number;

    // 状态
    @Column({
        type: 'tinyint',
        default: 1
    })
    status: number;

    // 是否推送
    @Column({
        type: 'tinyint',
        default: 0
    })
    push: number;

    // 标签
    @OneToMany(type => Tag, tag => tag.posts, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    tags: Tag[]

    // 推荐人/作者
    @ManyToOne(type => User, user => user.posts, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    user: User;
}
