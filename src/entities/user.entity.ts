import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, IsOptional } from 'class-validator';

import { Base } from './base';
import { Post } from './post.entity';

@Entity()
export class User extends Base {
    // 用户头像
    @Column()
    avatar: string;

    // 用户名
    @Column({ length: 50 })
    name: string;

    // 登录名
    @Column({ length: 50 })
    loginname: string;

    // 个人简介
    @Column()
    description: string;

    // email
    @Column()
    @IsOptional()
    @IsEmail()
    email: string;

    // 文章
    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    // weixin openid
    @Column({length: 50})
    openid: string;
}
