import { Controller, Get, Post, Session, Res, Body, Render, Param, Query, UseGuards, UseFilters } from '@nestjs/common';

import { AuthExceptionFilter } from '../filters/auth.filter';
import { SessionGuard } from '../guards/session.guard';

import { IntPipe } from '../pipes/int.pipe';

import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { TagService } from '../services/tag.service';

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

    @Get('write')
    @Render('admin/write')
    write(@Session() session) {
        const message = session.message;
        session.message = null;
        return { message };
    }

    @Post('write')
    async writeSave(@Session() session, @Res() res, @Body() body) {
        body.user = session.user;
        if (body.tags) {
            body.tags = await this.tagService.addTags(body.tags.split(','));
        }
        await this.postService.add(body);
        session.message = '保存成功';
        res.redirect('./write');
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
            body.tags = await this.tagService.addTags(body.tags.split(','));
        } else {
            body.tags = [];
        }
        const post = await this.postService.updateById(id, body);
        return { post, message: '保存成功' };
    }
}
