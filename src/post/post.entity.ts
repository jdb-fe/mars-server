import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
    @PrimaryGeneratedColumn() id: number;

    @Column({ length: 100 }) title: string;

    @Column('text') description: string;

    @Column() html: string;

    @Column('int') views: number;

    @Column() status: boolean;
}
