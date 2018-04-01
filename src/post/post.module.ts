import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';

import { Post } from './post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    components: [PostService],
    controllers: [PostController],
})
export class PostModule {}
