import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { IsFQDN, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

import { Base } from './base';

@Entity()
export class Rule extends Base {
    // 域名
    @Column({
        length: 50
    })
    @IsFQDN()
    @IsNotEmpty()
    host: string;

    // 路径
    @Column({
        length: 100
    })
    path: string;

    // 标题解析规则
    @Column({
        length: 100
    })
    @MinLength(13)
    @IsNotEmpty()
    title: string;

    // 缩略图解析规则
    @Column({
        length: 100,
        nullable: true
    })
    @IsOptional()
    @MinLength(20)
    thumb: string;

    // 描述解析规则
    @Column({
        length: 100,
        nullable: true
    })
    @IsOptional()
    @MinLength(13)
    description: string;

    // 内容解析规则
    @Column({
        length: 100
    })
    @MinLength(13)
    @IsNotEmpty()
    html: string;
}
