import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';

import { BaseEntity } from '../common/base.entity';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
    @IsEmail()
    email: string;

}
