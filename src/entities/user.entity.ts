import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { IsEmail, IsUrl } from 'class-validator';

import { Base } from './base';

@Entity()
export class User extends Base {
    // 用户头像
    @Column()
    @IsUrl()
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
    @IsEmail()
    email: string;
}
