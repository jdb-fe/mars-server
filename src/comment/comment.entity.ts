import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../common/base.entity';

@Entity()
export class Comment extends BaseEntity {
    // 评论内容
    @Column('text')
    content: string;

    // 点赞人
    @Column('int')
    likes: number;
}
