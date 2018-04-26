import { Entity, Column, OneToMany, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

import { Base } from './base';
import { Tag } from './tag.entity';

import { html2md } from '../utils/utils';

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
        nullable: true
    })
    thumb: string;

    // 原文地址
    @Column({
        length: 150
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

    @BeforeInsert()
    toMarkdown() {
        if (this.html) {
            this.markdown = html2md(this.html);
        }
    }
}
