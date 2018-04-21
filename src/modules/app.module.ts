import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Schedule from 'node-schedule';

import { CommonModule } from './common.module';
import { WechatModule } from './wechat.module';

import { IndexController } from '../controllers/index.controller';
import { PostController } from '../controllers/post.controller';
import { ApiController } from '../controllers/api.controller';

import { PostService } from '../services/post.service';
import { ConfigService } from '../services/config.service';
import { sendMail } from '../utils/utils';
import * as pug from 'pug';
import * as path from 'path';
import moment from 'moment';

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
export class AppModule implements OnModuleInit {
    constructor(
        private readonly postService: PostService,
        private readonly configService: ConfigService,
    ) { }
    onModuleInit() {
        const compileFunc = pug.compileFile(path.join(__dirname, '..', 'views', 'daily.pug'));
        Schedule.scheduleJob({ hour: 10 }, async () => {
            let config = await this.configService.get();
            let posts = await this.postService.findNonpush();
            let date = moment().format('YYYY-MM-DD');
            sendMail(config, compileFunc({ date, posts }));
        });
    }
}
