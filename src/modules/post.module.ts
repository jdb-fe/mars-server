import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from '../services/post.service';
import { PostController } from '../controllers/post.controller';

import { Post } from '../entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    components: [PostService],
    controllers: [PostController],
})
export class PostModule {}
