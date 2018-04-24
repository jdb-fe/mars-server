import { Controller, Get, Param } from '@nestjs/common';

import { PostService } from '../services/post.service';

@Controller('api')
export class ApiController {
    constructor(private readonly postService: PostService) {

    }

    @Get('post')
    findAll() {
        return this.postService.findByPage();
    }

    @Get('post/:id')
    findById(@Param() params) {
        return this.postService.findById(params.id);
    }
}
