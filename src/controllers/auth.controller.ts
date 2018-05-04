import { Controller, Get, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('token')
    createToken(@Body('loginname') loginname, @Body('password') password): Promise<any> {
        return this.authService.createToken(loginname, password);
    }
}
