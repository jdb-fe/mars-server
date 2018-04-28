import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Config {
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

    /**
     * 微信公众号账户密码
     */
    @Column('simple-json')
    wechat: {user: string, pass: string};
}
