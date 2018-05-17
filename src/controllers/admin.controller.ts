import { Controller, Get, Post, Req, Body, Render, Param, Query, UseGuards, UseFilters } from '@nestjs/common';

import { AuthExceptionFilter } from '../filters/auth.filter';
import { SessionGuard } from '../guards/session.guard';

import { IntPipe } from '../pipes/int.pipe';

import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { TagService } from '../services/tag.service';
import { Tag } from '../entities/tag.entity';

@Controller('admin')
@UseFilters(new AuthExceptionFilter())
@UseGuards(new SessionGuard())
export class AdminController {
    constructor(
        private readonly postService: PostService,
        private readonly authService: AuthService,
        private readonly tagService: TagService
    ) {}

    @Get()
    @Render('admin/index')
    async postList(@Query('page', new IntPipe(false)) page) {
        if (page < 1) {
            page = 1;
        }
        return this.postService.findByPage(page);
    }

    @Get('post/edit/:id')
    @Render('admin/post')
    async postDetail(@Param('id', new IntPipe()) id) {
        const post:any = await this.postService.findById(id);
        if (post.tags.length) {
            post.tags = post.tags.map(tag => tag.name);
        }
        return { post };
    }

    @Post('post/edit/:id')
    @Render('admin/post')
    async postEdit(@Param('id', new IntPipe()) id, @Body() body) {
        if (body.tags) {
            let tags = body.tags.split(',');
            body.tags = await Promise.all(
                tags.map(tagName =>
                    this.tagService.findByName(tagName).then(tagEntity => {
                        if (!tagEntity) {
                            tagEntity = new Tag();
                            tagEntity.name = tagName;
                        }
                        return tagEntity;
                    })
                )
            );
        } else {
            body.tags = [];
        }
        const post = await this.postService.updateById(id, body);
        return { post, message: '保存成功' };
    }
}
