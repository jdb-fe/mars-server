import { Entity, Column, ManyToOne } from 'typeorm';

import { Base } from './base';

@Entity()
export class CommentEntity extends Base {
    // 评论内容
    @Column('text')
    content: string;

    // 文章
    @Column('int')
    postId: number

    // 评论人
    @Column('int')
    userId: number
}
