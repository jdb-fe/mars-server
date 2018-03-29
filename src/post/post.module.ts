import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    components: [PostService],
    controllers: [PostController],
})
export class PostModule {}
