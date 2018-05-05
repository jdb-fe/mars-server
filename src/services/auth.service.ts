import { Component } from '@nestjs/common';
import { createHmac } from 'crypto';
import * as jwt from 'jsonwebtoken';

import { UserService } from './user.service';
import Config from '../config';

export interface JwtPayload {
    id: number;
    loginname: string;
}

@Component()
export class AuthService {
    constructor(private readonly userService: UserService) {
    }

    async createToken(loginname: string, password: string) {
        const user = await this.userService.findByName(loginname);
        if (!user) {
            throw new Error('User Do not exists!');
        }
        if (user.password !== createHmac('md5', password).digest('hex')) {
            throw new Error('Password is incorrect!');
        }
        const playload: JwtPayload = {
            id: user.id,
            loginname: user.loginname
        };
        const expiresIn = 60 * 60;
        const token = jwt.sign(playload, Config.jwtSecret, { expiresIn });

        return {
            expires: expiresIn,
            token
        };
    }

    async validateUser(payload: JwtPayload): Promise<boolean> {
        return true;
    }
}
