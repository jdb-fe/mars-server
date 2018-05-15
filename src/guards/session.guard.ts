import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const httpContext = context.switchToHttp();
        const [request, response] = [
          httpContext.getRequest(),
          httpContext.getResponse()
        ];
        const login = request.session && request.session.user;
        if (!login) {
            throw new UnauthorizedException();
        }
        return true;
    }
}
