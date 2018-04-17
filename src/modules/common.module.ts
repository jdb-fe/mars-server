import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import importToArray from '../utils/import-to-array';
import * as entities from '../entities/index';
import { PostService } from '../services/post.service';

@Module({
    imports: [TypeOrmModule.forFeature(importToArray(entities))],
    components: [PostService],
    exports: [PostService]
})
export class CommonModule {}
