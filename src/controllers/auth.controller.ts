import { Controller, Get, Render, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('login')
    @Render('login')
    login() {

    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    async loginAction(@Req() req) {


    }
}
