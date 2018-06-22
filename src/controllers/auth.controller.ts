import { Controller, Get, Render, Post, Session, Res, Query, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('login')
    @Render('login')
    login(@Session() session) {
        const message = session.message;
        session.message = null;
        return { message };
    }

    @Post('login')
    async loginAction(@Res() res, @Session() session, @Body() body, @Query('redirect') redirect) {
        try {
            const user = await this.authService.validateUser(body.loginname, body.password);
            session.user = user;
            res.redirect(redirect || '/admin/');
        } catch (error) {
            session.message = error.message;
            res.redirect('/login/');
        }
    }
}
