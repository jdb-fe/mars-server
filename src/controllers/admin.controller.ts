import { Controller, Get, Post, Res, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';


@Controller('admin')
// @UseGuards(AuthGuard('jwt'))
export class AdminController {
    constructor(
        private readonly postService: PostService,
        private readonly authService: AuthService,
    ) {}

    @Get('login')
    login(@Res() res) {
        res.render('login');
    }

    @Post('login')
    async loginAction(@Res() res, @Body('loginname') loginname, @Body('password') password) {
        const tokens = await this.authService.createToken(loginname, password);
        console.log(tokens);
    }
}
