import { Controller, Get, Post, Req, Body, Render, UseGuards, UseFilters } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';

import { AuthExceptionFilter } from '../filters/auth.filter';
import { SessionGuard } from '../guards/session.guard';

@Controller('admin')
@UseFilters(new AuthExceptionFilter())
@UseGuards(new SessionGuard())
export class AdminController {
    constructor(
        private readonly postService: PostService,
        private readonly authService: AuthService,
    ) {}

    @Get()
    @Render('rule')
    async post(@Req() req) {

    }
}
