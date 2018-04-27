import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Schedule from 'node-schedule';

import { CommonModule } from './common.module';
import { WechatModule } from './wechat.module';

import { IndexController } from '../controllers/index.controller';
import { PostController } from '../controllers/post.controller';
import { ApiController } from '../controllers/api.controller';

import { ScheduleService } from '../services/schedule.service';
import { sendMail } from '../utils/utils';
import * as pug from 'pug';
import * as path from 'path';
import * as moment from 'moment';

@Module({
    imports: [TypeOrmModule.forRoot(), CommonModule, WechatModule],
    controllers: [IndexController, PostController, ApiController],
})
export class AppModule implements OnModuleInit {
    constructor(
        private readonly scheduleService: ScheduleService,
    ) {}
    onModuleInit() {
        this.scheduleService.start();
    }
}
