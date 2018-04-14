import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { IsFQDN } from 'class-validator';

import { Base } from './base';

export class Rule extends Base {
    // 域名
    @Column()
    @IsFQDN()
    host: string;
    
    // 路径
    @Column()
    path: string;

    // 标题解析规则
    @Column()
    title: string;

    // 缩略图解析规则
    @Column()
    thumb: string;

    // 描述解析规则
    @Column()
    description: string;

    // 内容解析规则
    @Column()
    html: string;
}