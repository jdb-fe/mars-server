import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from './common.module';
import { WechatModule } from './wechat.module';
import { AuthModule } from './auth.module';

import { IndexController } from '../controllers/index.controller';
import { PostController } from '../controllers/post.controller';
import { ApiController } from '../controllers/api.controller';
import { AdminController } from '../controllers/admin.controller';

import { ScheduleService } from '../services/schedule.service';

@Module({
    imports: [TypeOrmModule.forRoot(), CommonModule, WechatModule, AuthModule],
    controllers: [IndexController, PostController, ApiController, AdminController],
})
export class AppModule implements OnModuleInit {
    constructor(
        private readonly scheduleService: ScheduleService,
    ) {}
    onModuleInit() {
        this.scheduleService.start();
    }
}
