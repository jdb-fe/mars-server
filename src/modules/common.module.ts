import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { importToArray } from '../utils/utils';
import * as entities from '../entities/index';
import { PostService } from '../services/post.service';
import { ConfigService } from '../services/config.service';
import { RuleService } from '../services/rule.service';
import { ScheduleService } from '../services/schedule.service';
import { WechatService } from '../services/wechat.service';
import { UserService } from '../services/user.service';
import { TagService } from '../services/tag.service';

@Module({
    imports: [TypeOrmModule.forFeature(importToArray(entities))],
    providers: [PostService, ConfigService, RuleService, ScheduleService, WechatService, UserService, TagService],
    exports: [PostService, ConfigService, RuleService, ScheduleService, WechatService, UserService, TagService]
})
export class CommonModule {}
