import { Controller, Get, Param } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { PostEntity } from '../entities/post.entity';

@Controller('api')
export class ApiController {
    constructor(private readonly postService: PostService) {

    }

    @Get()
    findAll(): Promise<PostEntity[]> {
        return this.postService.findByPage();
    }

    @Get(':id')
    findById(@Param() params): Promise<PostEntity> {
        return this.postService.findById(params.id);
    }
}
