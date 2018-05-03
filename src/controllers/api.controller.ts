import { Controller, Get, Param, Query } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { IntPipe } from '../pipes/int.pipe';

@Controller('api')
export class ApiController {
    constructor(private readonly postService: PostService) {

    }

    @Get('post')
    async findAll(@Query('page', new IntPipe(false)) page, @Query('limit', new IntPipe(false)) limit) {
        if (page < 1) {
            page = 1;
        }
        if (limit < 0) {
            limit = 15;
        }
        const results = await this.postService.findByPage(page, limit);
        return this.success(results);
    }

    @Get('post/view')
    async postView(@Query('id', new IntPipe()) id) {
        await this.postService.increment(id, 'views');
        const post = await this.postService.findById(id, {select: ['views']});
        return this.success(post);
    }

    @Get('post/:id')
    async findById(@Param('id', new IntPipe()) id) {
        const post = await this.postService.findById(id);
        return this.success(post);
    }

    private success(data?: Object, msg = '') {
        return {
            error: {
                returnCode: 0,
                returnMessage: 'success',
                returnUserMessage: msg || '成功'
            },
            data: data
        };
    }
}
