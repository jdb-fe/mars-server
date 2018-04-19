import { ExtractJwt, Strategy } from 'passport-jwt';
import { Component, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from './passport.strategy';
import { AuthService } from '../services/auth.service';
import Config from '../config';

export interface JwtPayload {
    email: string;
}

@Component()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Config.jwtSecret,
        });
    }

    async validate(payload: JwtPayload, done: Function) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user);
    }
}
