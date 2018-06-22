import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
    redirectUrl: string
    constructor(redirectUrl = '/auth/login') {
        this.redirectUrl = redirectUrl;
    }
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const http = host.switchToHttp();
        const response = http.getResponse();
        const request = http.getRequest();
        response.redirect(`${this.redirectUrl}?redirect=${request.url}`);
    }
}
