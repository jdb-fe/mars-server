import { Controller, Get, Param, Res, ParseIntPipe } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { PostEntity } from '../entities/post.entity';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {

    }

    @Get()
    findAll(): Promise<PostEntity[]> {
        return this.postService.findByPage();
    }

    @Get(':id')
    findById(@Param('id', new ParseIntPipe()) id): Promise<PostEntity> {
        return this.postService.findById(id);
    }
}
