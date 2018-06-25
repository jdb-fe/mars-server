import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LoginGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = (request.cookies && request.cookies.user) || (request.session && request.session.user);
        if (user && user.id) {
            return true;
        }
        throw new UnauthorizedException();
    }
}
