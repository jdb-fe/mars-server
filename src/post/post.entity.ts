import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
    @PrimaryGeneratedColumn() id: number;
    // 标题
    @Column({ length: 100 })
    title: string;
    // 描述
    @Column()
    description: string;
    // 缩略图
    @Column()
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
