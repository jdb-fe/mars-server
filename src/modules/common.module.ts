import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { Tag } from '../entities/tag.entity';
import { User } from '../entities/user.entity';

import { PostService } from '../services/post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Comment, Tag, User])],
    components: [PostService],
    exports: [PostService]
})
export class CommonModule {}
