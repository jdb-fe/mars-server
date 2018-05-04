import { Controller, Get, Res, Post, Body, Query, Param } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { IRule, RuleService } from '../services/rule.service';
import { IntPipe } from '../pipes/int.pipe';
import { toHtml } from '../utils/htmlMarkdown';

@Controller()
export class IndexController {
    constructor(
        private readonly postService: PostService,
        private readonly ruleService: RuleService
    ) {}

    @Get()
    async root(@Res() res, @Query('page', new IntPipe(false)) page) {
        if (page < 1) {
            page = 1;
        }
        const results = await this.postService.findByPage(page);
        res.render('index', results);
    }

    @Get('post/:id')
    async postDetail(@Res() res, @Param('id', new IntPipe()) id) {
        const post = await this.postService.findById(id);
        if (post.markdown) {
            post.html = toHtml(post.markdown);
        }
        res.render('detail', {post});
    }

    @Get('rule')
    postRule(@Res() res) {
        res.render('rule');
    }

    @Post('rule')
    async addRule(@Res() res, @Body() data: IRule) {
        const ret = await this.ruleService.insert(data);
        res.render('rule', {message: '添加成功'});
    }
}
