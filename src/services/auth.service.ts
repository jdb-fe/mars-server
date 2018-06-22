import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { UserService } from './user.service';
import Config from '../config';
import { User } from '../entities/user.entity';

export interface JwtPayload {
    loginname: string;
    password: string;
}

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {
    }

    async createToken(loginname: string, password: string) {
        const user = await this.userService.findOne({loginname});
        if (!user) {
            throw new Error('User Do not exists!');
        }
        if (user.validPassword(password)) {
            throw new Error('Password is incorrect!');
        }
        const playload: JwtPayload = {
            password: user.password,
            loginname: user.loginname
        };
        const expiresIn = 60 * 60;
        const token = jwt.sign(playload, Config.jwtSecret, { expiresIn });

        return {
            expires: expiresIn,
            token
        };
    }

    async validateUser(loginname: string, password: string): Promise<User> {
        const user = await this.userService.findOne({loginname});
        if (!user) {
            throw new Error('User Do not exists!');
        }
        if (!user.validPassword(password)) {
            throw new Error('Password is incorrect!');
        }
        return user;
    }
}
