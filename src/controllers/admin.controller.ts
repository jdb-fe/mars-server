import { Controller, Get, Post, Req, Body, Render } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';


@Controller('admin')
export class AdminController {
    constructor(
        private readonly postService: PostService,
        private readonly authService: AuthService,
    ) {}

    @Get()
    @Render('rule')
    async post(@Req() req) {
        console.log(req.isAuthenticated())
    }
}
