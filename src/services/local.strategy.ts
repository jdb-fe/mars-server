import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from './user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            usernameField: 'loginname',
            passwordField: 'password',
        });
    }

    async validate(loginname: string, password: string, done: Function) {
        try {
            const user = await this.userService.findOne({loginname});
            if (!user.validPassword(password)) {
                return done(null, false, { message: '用户不存在或密码错误！' });
            }
            return done(null, user);
        } catch (error) {
            return done('用户不存在或密码错误！');
        }
    }
}
