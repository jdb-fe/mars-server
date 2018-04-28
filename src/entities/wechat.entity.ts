import { Entity, Column, PrimaryColumn } from 'typeorm';

// 微信公众号关注用户
@Entity()
export class Wechat {
    // 微信公众号关注用户的openid
    @PrimaryColumn({length: 50})
    openid: string;
    
    // 微信头像
    @Column()
    avatar: string;

    // 城市
    @Column({length: 20})
    city: string;

    // 国家
    @Column({length: 20})
    country: string;

    // 省份
    @Column({length: 20})
    province: string;

    // 性别
    @Column('tinyint')
    gender: number;

    // 昵称
    @Column({length: 30})
    name: string;
    
    // 备注
    @Column({length: 40})
    remark: string;

    // 签名
    @Column({length: 50})
    signature: string;

    // 关注时间
    @Column()
    createTime: number;
}