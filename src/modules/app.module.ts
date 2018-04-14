import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from './common.module';
import { WechatModule } from './wechat.module';

import { IndexController } from '../controllers/index.controller';
import { PostController } from '../controllers/post.controller';
import { ApiController } from '../controllers/api.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        CommonModule,
        WechatModule
    ],
    controllers: [
        IndexController,
        PostController,
        ApiController
    ]
})
export class AppModule { }
