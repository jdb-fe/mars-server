import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wechat } from '../entities/wechat.entity';

@Component()
export class WechatService {
    constructor(
        @InjectRepository(Wechat)
        private readonly repository: Repository<Wechat>,
    ) { }
    sync(uers) {
        return this.repository.save(uers);
    }
    findByOpenId(openid: string) {
        return this.repository.findOne({ openid: openid });
    }
}