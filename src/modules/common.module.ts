import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { importToArray } from '../utils/utils';
import * as entities from '../entities/index';
import { PostService } from '../services/post.service';
import { ConfigService } from '../services/config.service';
import { RuleService } from '../services/rule.service';

@Module({
    imports: [TypeOrmModule.forFeature(importToArray(entities))],
    components: [PostService, ConfigService, RuleService],
    exports: [PostService, ConfigService, RuleService]
})
export class CommonModule {}
