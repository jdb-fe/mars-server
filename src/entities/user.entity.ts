import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, IsOptional } from 'class-validator';
import { createHmac } from 'crypto';

import { Base } from './base';
import { Post } from './post.entity';

@Entity()
export class User extends Base {
    // 用户头像
    @Column({
        nullable: true,
    })
    avatar: string;

    // 用户名
    @Column({ length: 50 })
    name: string;

    // 登录名
    @Column({
        length: 50,
        nullable: true,
    })
    loginname: string;

    // 登录密码
    @Column({
        length: 32,
        nullable: true,
    })
    password: string;

    // 个人简介
    @Column({
        nullable: true,
    })
    description: string;

    // email
    @Column({
        nullable: true,
    })
    @IsOptional()
    @IsEmail()
    email: string;

    // 文章
    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    // weixin openid
    @Column({
        length: 50,
        nullable: true,
    })
    openid: string;

    validPassword(password: string): boolean {
        return this.password === createHmac('md5', password).digest('hex');
    }
}
