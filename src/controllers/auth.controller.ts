import { Controller, Get, Render, Post, Body, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('login')
    @Render('login')
    login() {

    }

    @Post('login')
    async loginAction(@Res() res, @Req() req) {
        try {
            const body = req.body;
            const user = await this.authService.validateUser(body.loginname, body.password);
            req.session.user = user;
            res.redirect('/admin/');
        } catch (error) {
            res.render('login', {message: error.message});
        }
    }
}
