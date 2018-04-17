import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import importToArray from '../utils/import-to-array';
import * as entities from '../entities/index';
import { PostService } from '../services/post.service';
import { ConfigService } from '../services/config.service';

@Module({
    imports: [TypeOrmModule.forFeature(importToArray(entities))],
    components: [PostService, ConfigService],
    exports: [PostService, ConfigService]
})
export class CommonModule {}
