import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }) createTime: string;
}
