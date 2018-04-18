import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConfigEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 订阅邮箱
     */
    @Column('simple-array')
    subscriber: string[];

    /**
     * 邮箱发送配置
     */
    @Column('simple-json')
    mail: {user: string, pass: string, host: string};

    /**
     * mercury 文章抓取token
     */
    @Column()
    mercury: string;
}
