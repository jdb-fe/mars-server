import { Entity, Column } from 'typeorm';
import { IsUrl } from 'class-validator';

import { Base } from '../common/base.entity';

@Entity()
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
    status: boolean;
}
