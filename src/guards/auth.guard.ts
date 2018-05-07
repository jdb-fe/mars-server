import * as passport from 'passport';
import {
    CanActivate,
    ExecutionContext,
    mixin,
    UnauthorizedException,
} from '@nestjs/common';

export interface AuthGuardOptions {
    session?: boolean;
    successMessage?: string;
    successRedirect?: string;
    successFlash?: string;
    failureRedirect?: string;
    failureMessage?: string;
    assignProperty?: string;
}

export const defaultOptions = {
    session: true,
    successRedirect: '/admin/',
    failureRedirect: '/auth/login',
    assignProperty: 'user',
};

export function AuthGuard(type, options: AuthGuardOptions & any = defaultOptions,) {
    options = { ...defaultOptions, ...options };
    return mixin(
        class implements CanActivate {
            async canActivate(context: ExecutionContext): Promise<boolean> {
                const httpContext = context.switchToHttp();
                const [request, response] = [
                    httpContext.getRequest(),
                    httpContext.getResponse(),
                ];
                passport.authenticate(type, options)(request, response);
                return true;
            }
        },
    );
}
