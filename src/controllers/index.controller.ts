import { Controller, Get, Res, Post, Body } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { IRule, RuleService } from '../services/rule.service';

@Controller()
export class IndexController {
    constructor(
        private readonly postService: PostService,
        private readonly ruleService: RuleService
    ) {}

    @Get()
    async root(@Res() res) {
        const posts = await this.postService.findByPage();
        res.render('index', { posts: posts});
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
